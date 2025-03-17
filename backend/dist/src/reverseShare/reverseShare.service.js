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
exports.ReverseShareService = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
const config_service_1 = require("../config/config.service");
const file_service_1 = require("../file/file.service");
const prisma_service_1 = require("../prisma/prisma.service");
const date_util_1 = require("../utils/date.util");
let ReverseShareService = class ReverseShareService {
    constructor(config, prisma, fileService) {
        this.config = config;
        this.prisma = prisma;
        this.fileService = fileService;
    }
    async create(data, creatorId) {
        const expirationDate = moment()
            .add(data.shareExpiration.split("-")[0], data.shareExpiration.split("-")[1])
            .toDate();
        const parsedExpiration = (0, date_util_1.parseRelativeDateToAbsolute)(data.shareExpiration);
        const maxExpiration = this.config.get("share.maxExpiration");
        if (maxExpiration.value !== 0 &&
            parsedExpiration >
                moment().add(maxExpiration.value, maxExpiration.unit).toDate()) {
            throw new common_1.BadRequestException("Expiration date exceeds maximum expiration date");
        }
        const globalMaxShareSize = this.config.get("share.maxSize");
        if (globalMaxShareSize < data.maxShareSize)
            throw new common_1.BadRequestException(`Max share size can't be greater than ${globalMaxShareSize} bytes.`);
        const reverseShare = await this.prisma.reverseShare.create({
            data: {
                shareExpiration: expirationDate,
                remainingUses: data.maxUseCount,
                maxShareSize: data.maxShareSize,
                sendEmailNotification: data.sendEmailNotification,
                simplified: data.simplified,
                publicAccess: data.publicAccess,
                creatorId,
            },
        });
        return reverseShare.token;
    }
    async getByToken(reverseShareToken) {
        if (!reverseShareToken)
            return null;
        const reverseShare = await this.prisma.reverseShare.findUnique({
            where: { token: reverseShareToken },
        });
        return reverseShare;
    }
    async getAllByUser(userId) {
        const reverseShares = await this.prisma.reverseShare.findMany({
            where: {
                creatorId: userId,
                shareExpiration: { gt: new Date() },
            },
            orderBy: {
                shareExpiration: "desc",
            },
            include: { shares: { include: { creator: true } } },
        });
        return reverseShares;
    }
    async isValid(reverseShareToken) {
        const reverseShare = await this.prisma.reverseShare.findUnique({
            where: { token: reverseShareToken },
        });
        if (!reverseShare)
            return false;
        const isExpired = new Date() > reverseShare.shareExpiration;
        const remainingUsesExceeded = reverseShare.remainingUses <= 0;
        return !(isExpired || remainingUsesExceeded);
    }
    async remove(id) {
        const shares = await this.prisma.share.findMany({
            where: { reverseShare: { id } },
        });
        for (const share of shares) {
            await this.prisma.share.delete({ where: { id: share.id } });
            await this.fileService.deleteAllFiles(share.id);
        }
        await this.prisma.reverseShare.delete({ where: { id } });
    }
};
exports.ReverseShareService = ReverseShareService;
exports.ReverseShareService = ReverseShareService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        prisma_service_1.PrismaService,
        file_service_1.FileService])
], ReverseShareService);
//# sourceMappingURL=reverseShare.service.js.map