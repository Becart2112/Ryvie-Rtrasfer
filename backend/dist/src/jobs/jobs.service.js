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
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const fs = require("fs");
const moment = require("moment");
const file_service_1 = require("../file/file.service");
const prisma_service_1 = require("../prisma/prisma.service");
const reverseShare_service_1 = require("../reverseShare/reverseShare.service");
const constants_1 = require("../constants");
let JobsService = JobsService_1 = class JobsService {
    constructor(prisma, reverseShareService, fileService) {
        this.prisma = prisma;
        this.reverseShareService = reverseShareService;
        this.fileService = fileService;
        this.logger = new common_1.Logger(JobsService_1.name);
    }
    async deleteExpiredShares() {
        const expiredShares = await this.prisma.share.findMany({
            where: {
                AND: [
                    { expiration: { lt: new Date() } },
                    { expiration: { not: moment(0).toDate() } },
                ],
            },
        });
        for (const expiredShare of expiredShares) {
            await this.prisma.share.delete({
                where: { id: expiredShare.id },
            });
            await this.fileService.deleteAllFiles(expiredShare.id);
        }
        if (expiredShares.length > 0) {
            this.logger.log(`Deleted ${expiredShares.length} expired shares`);
        }
    }
    async deleteExpiredReverseShares() {
        const expiredReverseShares = await this.prisma.reverseShare.findMany({
            where: {
                shareExpiration: { lt: new Date() },
            },
        });
        for (const expiredReverseShare of expiredReverseShares) {
            await this.reverseShareService.remove(expiredReverseShare.id);
        }
        if (expiredReverseShares.length > 0) {
            this.logger.log(`Deleted ${expiredReverseShares.length} expired reverse shares`);
        }
    }
    async deleteUnfinishedShares() {
        const unfinishedShares = await this.prisma.share.findMany({
            where: {
                createdAt: { lt: moment().subtract(1, "day").toDate() },
                uploadLocked: false,
            },
        });
        for (const unfinishedShare of unfinishedShares) {
            await this.prisma.share.delete({
                where: { id: unfinishedShare.id },
            });
            await this.fileService.deleteAllFiles(unfinishedShare.id);
        }
        if (unfinishedShares.length > 0) {
            this.logger.log(`Deleted ${unfinishedShares.length} unfinished shares`);
        }
    }
    deleteTemporaryFiles() {
        let filesDeleted = 0;
        const shareDirectories = fs
            .readdirSync(constants_1.SHARE_DIRECTORY, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
        for (const shareDirectory of shareDirectories) {
            const temporaryFiles = fs
                .readdirSync(`${constants_1.SHARE_DIRECTORY}/${shareDirectory}`)
                .filter((file) => file.endsWith(".tmp-chunk"));
            for (const file of temporaryFiles) {
                const stats = fs.statSync(`${constants_1.SHARE_DIRECTORY}/${shareDirectory}/${file}`);
                const isOlderThanOneDay = moment(stats.mtime)
                    .add(1, "day")
                    .isBefore(moment());
                if (isOlderThanOneDay) {
                    fs.rmSync(`${constants_1.SHARE_DIRECTORY}/${shareDirectory}/${file}`);
                    filesDeleted++;
                }
            }
        }
        this.logger.log(`Deleted ${filesDeleted} temporary files`);
    }
    async deleteExpiredTokens() {
        const { count: refreshTokenCount } = await this.prisma.refreshToken.deleteMany({
            where: { expiresAt: { lt: new Date() } },
        });
        const { count: loginTokenCount } = await this.prisma.loginToken.deleteMany({
            where: { expiresAt: { lt: new Date() } },
        });
        const { count: resetPasswordTokenCount } = await this.prisma.resetPasswordToken.deleteMany({
            where: { expiresAt: { lt: new Date() } },
        });
        const deletedTokensCount = refreshTokenCount + loginTokenCount + resetPasswordTokenCount;
        if (deletedTokensCount > 0) {
            this.logger.log(`Deleted ${deletedTokensCount} expired refresh tokens`);
        }
    }
};
exports.JobsService = JobsService;
__decorate([
    (0, schedule_1.Cron)("0 * * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "deleteExpiredShares", null);
__decorate([
    (0, schedule_1.Cron)("0 * * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "deleteExpiredReverseShares", null);
__decorate([
    (0, schedule_1.Cron)("0 */6 * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "deleteUnfinishedShares", null);
__decorate([
    (0, schedule_1.Cron)("0 0 * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsService.prototype, "deleteTemporaryFiles", null);
__decorate([
    (0, schedule_1.Cron)("1 * * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "deleteExpiredTokens", null);
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        reverseShare_service_1.ReverseShareService,
        file_service_1.FileService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map