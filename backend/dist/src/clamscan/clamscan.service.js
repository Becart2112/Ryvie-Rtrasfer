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
var ClamScanService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClamScanService = void 0;
const common_1 = require("@nestjs/common");
const NodeClam = require("clamscan");
const fs = require("fs");
const file_service_1 = require("../file/file.service");
const prisma_service_1 = require("../prisma/prisma.service");
const constants_1 = require("../constants");
const clamscanConfig = {
    clamdscan: {
        host: constants_1.CLAMAV_HOST,
        port: constants_1.CLAMAV_PORT,
        localFallback: false,
    },
    preference: "clamdscan",
};
let ClamScanService = ClamScanService_1 = class ClamScanService {
    constructor(fileService, prisma) {
        this.fileService = fileService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(ClamScanService_1.name);
        this.ClamScan = new NodeClam()
            .init(clamscanConfig)
            .then((res) => {
            this.logger.log("ClamAV is active");
            return res;
        })
            .catch(() => {
            this.logger.log("ClamAV is not active");
            return null;
        });
    }
    async check(shareId) {
        const clamScan = await this.ClamScan;
        if (!clamScan)
            return [];
        const infectedFiles = [];
        const files = fs
            .readdirSync(`${constants_1.SHARE_DIRECTORY}/${shareId}`)
            .filter((file) => file != "archive.zip");
        for (const fileId of files) {
            const { isInfected } = await clamScan
                .isInfected(`${constants_1.SHARE_DIRECTORY}/${shareId}/${fileId}`)
                .catch(() => {
                this.logger.log("ClamAV is not active");
                return { isInfected: false };
            });
            const fileName = (await this.prisma.file.findUnique({ where: { id: fileId } })).name;
            if (isInfected) {
                infectedFiles.push({ id: fileId, name: fileName });
            }
        }
        return infectedFiles;
    }
    async checkAndRemove(shareId) {
        const infectedFiles = await this.check(shareId);
        if (infectedFiles.length > 0) {
            await this.fileService.deleteAllFiles(shareId);
            await this.prisma.file.deleteMany({ where: { shareId } });
            const fileNames = infectedFiles.map((file) => file.name).join(", ");
            await this.prisma.share.update({
                where: { id: shareId },
                data: {
                    removedReason: `Your share got removed because the file(s) ${fileNames} are malicious.`,
                },
            });
            this.logger.warn(`Share ${shareId} deleted because it contained ${infectedFiles.length} malicious file(s)`);
        }
    }
};
exports.ClamScanService = ClamScanService;
exports.ClamScanService = ClamScanService = ClamScanService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_service_1.FileService,
        prisma_service_1.PrismaService])
], ClamScanService);
//# sourceMappingURL=clamscan.service.js.map