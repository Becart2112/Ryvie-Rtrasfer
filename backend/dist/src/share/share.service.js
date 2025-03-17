"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const archiver = require("archiver");
const argon = require("argon2");
const fs = require("fs");
const moment = require("moment");
const clamscan_service_1 = require("../clamscan/clamscan.service");
const config_service_1 = require("../config/config.service");
const email_service_1 = require("../email/email.service");
const file_service_1 = require("../file/file.service");
const prisma_service_1 = require("../prisma/prisma.service");
const reverseShare_service_1 = require("../reverseShare/reverseShare.service");
const date_util_1 = require("../utils/date.util");
const constants_1 = require("../constants");
let ShareService = class ShareService {
    constructor(prisma, configService, fileService, emailService, config, jwtService, reverseShareService, clamScanService) {
        this.prisma = prisma;
        this.configService = configService;
        this.fileService = fileService;
        this.emailService = emailService;
        this.config = config;
        this.jwtService = jwtService;
        this.reverseShareService = reverseShareService;
        this.clamScanService = clamScanService;
    }
    async create(share, user, reverseShareToken) {
        if (!(await this.isShareIdAvailable(share.id)).isAvailable)
            throw new common_1.BadRequestException("Share id already in use");
        if (!share.security || Object.keys(share.security).length == 0)
            share.security = undefined;
        if (share.security?.password) {
            share.security.password = await argon.hash(share.security.password);
        }
        let expirationDate;
        const reverseShare = await this.reverseShareService.getByToken(reverseShareToken);
        if (reverseShare) {
            expirationDate = reverseShare.shareExpiration;
        }
        else {
            const parsedExpiration = (0, date_util_1.parseRelativeDateToAbsolute)(share.expiration);
            const expiresNever = moment(0).toDate() == parsedExpiration;
            const maxExpiration = this.config.get("share.maxExpiration");
            if (maxExpiration.value !== 0 &&
                (expiresNever ||
                    parsedExpiration >
                        moment().add(maxExpiration.value, maxExpiration.unit).toDate())) {
                throw new common_1.BadRequestException("Expiration date exceeds maximum expiration date");
            }
            expirationDate = parsedExpiration;
        }
        fs.mkdirSync(`${constants_1.SHARE_DIRECTORY}/${share.id}`, {
            recursive: true,
        });
        const shareTuple = await this.prisma.share.create({
            data: {
                ...share,
                expiration: expirationDate,
                creator: { connect: user ? { id: user.id } : undefined },
                security: { create: share.security },
                recipients: {
                    create: share.recipients
                        ? share.recipients.map((email) => ({ email }))
                        : [],
                },
                storageProvider: this.configService.get("s3.enabled") ? "S3" : "LOCAL",
            },
        });
        if (reverseShare) {
            await this.prisma.reverseShare.update({
                where: { token: reverseShareToken },
                data: {
                    shares: {
                        connect: { id: shareTuple.id },
                    },
                },
            });
        }
        return shareTuple;
    }
    async createZip(shareId) {
        if (this.config.get("s3.enabled"))
            return;
        const path = `${constants_1.SHARE_DIRECTORY}/${shareId}`;
        const files = await this.prisma.file.findMany({ where: { shareId } });
        const archive = archiver("zip", {
            zlib: { level: this.config.get("share.zipCompressionLevel") },
        });
        const writeStream = fs.createWriteStream(`${path}/archive.zip`);
        for (const file of files) {
            archive.append(fs.createReadStream(`${path}/${file.id}`), {
                name: file.name,
            });
        }
        archive.pipe(writeStream);
        await archive.finalize();
    }
    async complete(id, reverseShareToken) {
        const share = await this.prisma.share.findUnique({
            where: { id },
            include: {
                files: true,
                recipients: true,
                creator: true,
                reverseShare: { include: { creator: true } },
            },
        });
        if (await this.isShareCompleted(id))
            throw new common_1.BadRequestException("Share already completed");
        if (share.files.length == 0)
            throw new common_1.BadRequestException("You need at least on file in your share to complete it.");
        if (share.files.length > 1)
            this.createZip(id).then(() => this.prisma.share.update({ where: { id }, data: { isZipReady: true } }));
        for (const recipient of share.recipients) {
            await this.emailService.sendMailToShareRecipients(recipient.email, share.id, share.creator, share.description, share.expiration);
        }
        const notifyReverseShareCreator = share.reverseShare
            ? this.config.get("smtp.enabled") &&
                share.reverseShare.sendEmailNotification
            : undefined;
        if (notifyReverseShareCreator) {
            await this.emailService.sendMailToReverseShareCreator(share.reverseShare.creator.email, share.id);
        }
        void this.clamScanService.checkAndRemove(share.id);
        if (share.reverseShare) {
            await this.prisma.reverseShare.update({
                where: { token: reverseShareToken },
                data: { remainingUses: { decrement: 1 } },
            });
        }
        const updatedShare = await this.prisma.share.update({
            where: { id },
            data: { uploadLocked: true },
        });
        return {
            ...updatedShare,
            notifyReverseShareCreator,
        };
    }
    async revertComplete(id) {
        return this.prisma.share.update({
            where: { id },
            data: { uploadLocked: false, isZipReady: false },
        });
    }
    async getShares() {
        const shares = await this.prisma.share.findMany({
            orderBy: {
                expiration: "desc",
            },
            include: { files: true, creator: true },
        });
        return shares.map((share) => {
            return {
                ...share,
                size: share.files.reduce((acc, file) => acc + parseInt(file.size), 0),
            };
        });
    }
    async getSharesByUser(userId) {
        const shares = await this.prisma.share.findMany({
            where: {
                creator: { id: userId },
                uploadLocked: true,
                OR: [
                    { expiration: { gt: new Date() } },
                    { expiration: { equals: moment(0).toDate() } },
                ],
            },
            orderBy: {
                expiration: "desc",
            },
            include: { recipients: true, files: true, security: true },
        });
        return shares.map((share) => {
            return {
                ...share,
                size: share.files.reduce((acc, file) => acc + parseInt(file.size), 0),
                recipients: share.recipients.map((recipients) => recipients.email),
                security: {
                    maxViews: share.security?.maxViews,
                    passwordProtected: !!share.security?.password,
                },
            };
        });
    }
    async get(id) {
        const share = await this.prisma.share.findUnique({
            where: { id },
            include: {
                files: {
                    orderBy: {
                        name: "asc",
                    },
                },
                creator: true,
                security: true,
            },
        });
        if (share.removedReason)
            throw new common_1.NotFoundException(share.removedReason, "share_removed");
        if (!share || !share.uploadLocked)
            throw new common_1.NotFoundException("Share not found");
        return {
            ...share,
            hasPassword: !!share.security?.password,
        };
    }
    async getMetaData(id) {
        const share = await this.prisma.share.findUnique({
            where: { id },
        });
        if (!share || !share.uploadLocked)
            throw new common_1.NotFoundException("Share not found");
        return share;
    }
    async remove(shareId, isDeleterAdmin = false) {
        const share = await this.prisma.share.findUnique({
            where: { id: shareId },
        });
        if (!share)
            throw new common_1.NotFoundException("Share not found");
        if (!share.creatorId && !isDeleterAdmin)
            throw new common_1.ForbiddenException("Anonymous shares can't be deleted");
        await this.fileService.deleteAllFiles(shareId);
        await this.prisma.share.delete({ where: { id: shareId } });
    }
    async isShareCompleted(id) {
        return (await this.prisma.share.findUnique({ where: { id } })).uploadLocked;
    }
    async isShareIdAvailable(id) {
        const share = await this.prisma.share.findUnique({ where: { id } });
        return { isAvailable: !share };
    }
    async increaseViewCount(share) {
        await this.prisma.share.update({
            where: { id: share.id },
            data: { views: share.views + 1 },
        });
    }
    async getShareToken(shareId, password) {
        const share = await this.prisma.share.findFirst({
            where: { id: shareId },
            include: {
                security: true,
            },
        });
        if (share?.security?.password) {
            if (!password) {
                throw new common_1.ForbiddenException("This share is password protected", "share_password_required");
            }
            const isPasswordValid = await argon.verify(share.security.password, password);
            if (!isPasswordValid) {
                throw new common_1.ForbiddenException("Wrong password", "wrong_password");
            }
        }
        if (share.security?.maxViews && share.security.maxViews <= share.views) {
            throw new common_1.ForbiddenException("Maximum views exceeded", "share_max_views_exceeded");
        }
        const token = await this.generateShareToken(shareId);
        await this.increaseViewCount(share);
        return token;
    }
    async generateShareToken(shareId) {
        const { expiration, createdAt } = await this.prisma.share.findUnique({
            where: { id: shareId },
        });
        const tokenPayload = {
            shareId,
            shareCreatedAt: moment(createdAt).unix(),
            iat: moment().unix(),
        };
        const tokenOptions = {
            secret: this.config.get("internal.jwtSecret"),
        };
        if (!moment(expiration).isSame(0)) {
            tokenOptions.expiresIn = moment(expiration).diff(new Date(), "seconds");
        }
        return this.jwtService.sign(tokenPayload, tokenOptions);
    }
    async verifyShareToken(shareId, token) {
        const { expiration, createdAt } = await this.prisma.share.findUnique({
            where: { id: shareId },
        });
        try {
            const claims = this.jwtService.verify(token, {
                secret: this.config.get("internal.jwtSecret"),
                ignoreExpiration: moment(expiration).isSame(0),
            });
            return (claims.shareId == shareId &&
                claims.shareCreatedAt == moment(createdAt).unix());
        }
        catch {
            return false;
        }
    }
};
exports.ShareService = ShareService;
exports.ShareService = ShareService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_service_1.ConfigService,
        file_service_1.FileService,
        email_service_1.EmailService,
        config_service_1.ConfigService,
        jwt_1.JwtService,
        reverseShare_service_1.ReverseShareService,
        clamscan_service_1.ClamScanService])
], ShareService);
//# sourceMappingURL=share.service.js.map