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
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const local_service_1 = require("./local.service");
const s3_service_1 = require("./s3.service");
const config_service_1 = require("../config/config.service");
const prisma_service_1 = require("../prisma/prisma.service");
let FileService = class FileService {
    constructor(prisma, localFileService, s3FileService, configService) {
        this.prisma = prisma;
        this.localFileService = localFileService;
        this.s3FileService = s3FileService;
        this.configService = configService;
    }
    getStorageService(storageProvider) {
        if (storageProvider != undefined)
            return storageProvider == "S3"
                ? this.s3FileService
                : this.localFileService;
        return this.configService.get("s3.enabled")
            ? this.s3FileService
            : this.localFileService;
    }
    async create(data, chunk, file, shareId) {
        const storageService = this.getStorageService();
        return storageService.create(data, chunk, file, shareId);
    }
    async get(shareId, fileId) {
        const share = await this.prisma.share.findFirst({
            where: { id: shareId },
        });
        const storageService = this.getStorageService(share.storageProvider);
        return storageService.get(shareId, fileId);
    }
    async remove(shareId, fileId) {
        const storageService = this.getStorageService();
        return storageService.remove(shareId, fileId);
    }
    async deleteAllFiles(shareId) {
        const storageService = this.getStorageService();
        return storageService.deleteAllFiles(shareId);
    }
    getZip(shareId) {
        const storageService = this.getStorageService();
        return storageService.getZip(shareId);
    }
    async streamToUint8Array(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on("end", () => resolve(new Uint8Array(Buffer.concat(chunks))));
            stream.on("error", reject);
        });
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        local_service_1.LocalFileService,
        s3_service_1.S3FileService,
        config_service_1.ConfigService])
], FileService);
//# sourceMappingURL=file.service.js.map