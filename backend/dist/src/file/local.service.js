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
exports.LocalFileService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const fs_1 = require("fs");
const fs = require("fs/promises");
const mime = require("mime-types");
const config_service_1 = require("../config/config.service");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
const constants_1 = require("../constants");
let LocalFileService = class LocalFileService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async create(data, chunk, file, shareId) {
        if (!file.id) {
            file.id = crypto.randomUUID();
        }
        else if (!(0, uuid_1.validate)(file.id)) {
            throw new common_1.BadRequestException("Invalid file ID format");
        }
        const share = await this.prisma.share.findUnique({
            where: { id: shareId },
            include: { files: true, reverseShare: true },
        });
        if (share.uploadLocked)
            throw new common_1.BadRequestException("Share is already completed");
        let diskFileSize;
        try {
            diskFileSize = (await fs.stat(`${constants_1.SHARE_DIRECTORY}/${shareId}/${file.id}.tmp-chunk`)).size;
        }
        catch {
            diskFileSize = 0;
        }
        const chunkSize = this.config.get("share.chunkSize");
        const expectedChunkIndex = Math.ceil(diskFileSize / chunkSize);
        if (expectedChunkIndex != chunk.index)
            throw new common_1.BadRequestException({
                message: "Unexpected chunk received",
                error: "unexpected_chunk_index",
                expectedChunkIndex,
            });
        const buffer = Buffer.from(data, "base64");
        const space = await fs.statfs(constants_1.SHARE_DIRECTORY);
        const availableSpace = space.bavail * space.bsize;
        if (availableSpace < buffer.byteLength) {
            throw new common_1.InternalServerErrorException("Not enough space on the server");
        }
        const fileSizeSum = share.files.reduce((n, { size }) => n + parseInt(size), 0);
        const shareSizeSum = fileSizeSum + diskFileSize + buffer.byteLength;
        if (shareSizeSum > this.config.get("share.maxSize") ||
            (share.reverseShare?.maxShareSize &&
                shareSizeSum > parseInt(share.reverseShare.maxShareSize))) {
            throw new common_1.HttpException("Max share size exceeded", common_1.HttpStatus.PAYLOAD_TOO_LARGE);
        }
        await fs.appendFile(`${constants_1.SHARE_DIRECTORY}/${shareId}/${file.id}.tmp-chunk`, buffer);
        const isLastChunk = chunk.index == chunk.total - 1;
        if (isLastChunk) {
            await fs.rename(`${constants_1.SHARE_DIRECTORY}/${shareId}/${file.id}.tmp-chunk`, `${constants_1.SHARE_DIRECTORY}/${shareId}/${file.id}`);
            const fileSize = (await fs.stat(`${constants_1.SHARE_DIRECTORY}/${shareId}/${file.id}`)).size;
            await this.prisma.file.create({
                data: {
                    id: file.id,
                    name: file.name,
                    size: fileSize.toString(),
                    share: { connect: { id: shareId } },
                },
            });
        }
        return file;
    }
    async get(shareId, fileId) {
        const fileMetaData = await this.prisma.file.findUnique({
            where: { id: fileId },
        });
        if (!fileMetaData)
            throw new common_1.NotFoundException("File not found");
        const file = (0, fs_1.createReadStream)(`${constants_1.SHARE_DIRECTORY}/${shareId}/${fileId}`);
        return {
            metaData: {
                mimeType: mime.contentType(fileMetaData.name.split(".").pop()),
                ...fileMetaData,
                size: fileMetaData.size,
            },
            file,
        };
    }
    async remove(shareId, fileId) {
        const fileMetaData = await this.prisma.file.findUnique({
            where: { id: fileId },
        });
        if (!fileMetaData)
            throw new common_1.NotFoundException("File not found");
        await fs.unlink(`${constants_1.SHARE_DIRECTORY}/${shareId}/${fileId}`);
        await this.prisma.file.delete({ where: { id: fileId } });
    }
    async deleteAllFiles(shareId) {
        await fs.rm(`${constants_1.SHARE_DIRECTORY}/${shareId}`, {
            recursive: true,
            force: true,
        });
    }
    getZip(shareId) {
        return (0, fs_1.createReadStream)(`${constants_1.SHARE_DIRECTORY}/${shareId}/archive.zip`);
    }
};
exports.LocalFileService = LocalFileService;
exports.LocalFileService = LocalFileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_service_1.ConfigService])
], LocalFileService);
//# sourceMappingURL=local.service.js.map