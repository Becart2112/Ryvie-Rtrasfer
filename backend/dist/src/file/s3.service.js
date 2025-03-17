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
var S3FileService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const prisma_service_1 = require("../prisma/prisma.service");
const config_service_1 = require("../config/config.service");
const crypto = require("crypto");
const mime = require("mime-types");
const uuid_1 = require("uuid");
let S3FileService = S3FileService_1 = class S3FileService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.logger = new common_1.Logger(S3FileService_1.name);
        this.multipartUploads = {};
    }
    async create(data, chunk, file, shareId) {
        if (!file.id) {
            file.id = crypto.randomUUID();
        }
        else if (!(0, uuid_1.validate)(file.id)) {
            throw new common_1.BadRequestException("Invalid file ID format");
        }
        const buffer = Buffer.from(data, "base64");
        const key = `${this.getS3Path()}${shareId}/${file.name}`;
        const bucketName = this.config.get("s3.bucketName");
        const s3Instance = this.getS3Instance();
        try {
            if (chunk.index === 0) {
                const multipartInitResponse = await s3Instance.send(new client_s3_1.CreateMultipartUploadCommand({
                    Bucket: bucketName,
                    Key: key,
                }));
                const uploadId = multipartInitResponse.UploadId;
                if (!uploadId) {
                    throw new Error("Failed to initialize multipart upload.");
                }
                this.multipartUploads[file.id] = {
                    uploadId,
                    parts: [],
                };
            }
            const multipartUpload = this.multipartUploads[file.id];
            if (!multipartUpload) {
                throw new common_1.InternalServerErrorException("Multipart upload session not found.");
            }
            const uploadId = multipartUpload.uploadId;
            const partNumber = chunk.index + 1;
            const uploadPartResponse = await s3Instance.send(new client_s3_1.UploadPartCommand({
                Bucket: bucketName,
                Key: key,
                PartNumber: partNumber,
                UploadId: uploadId,
                Body: buffer,
            }));
            multipartUpload.parts.push({
                ETag: uploadPartResponse.ETag,
                PartNumber: partNumber,
            });
            if (chunk.index === chunk.total - 1) {
                await s3Instance.send(new client_s3_1.CompleteMultipartUploadCommand({
                    Bucket: bucketName,
                    Key: key,
                    UploadId: uploadId,
                    MultipartUpload: {
                        Parts: multipartUpload.parts,
                    },
                }));
                delete this.multipartUploads[file.id];
            }
        }
        catch (error) {
            const multipartUpload = this.multipartUploads[file.id];
            if (multipartUpload) {
                try {
                    await s3Instance.send(new client_s3_1.AbortMultipartUploadCommand({
                        Bucket: bucketName,
                        Key: key,
                        UploadId: multipartUpload.uploadId,
                    }));
                }
                catch (abortError) {
                    console.error("Error aborting multipart upload:", abortError);
                }
                delete this.multipartUploads[file.id];
            }
            this.logger.error(error);
            throw new Error("Multipart upload failed. The upload has been aborted.");
        }
        const isLastChunk = chunk.index == chunk.total - 1;
        if (isLastChunk) {
            const fileSize = await this.getFileSize(shareId, file.name);
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
        const fileName = (await this.prisma.file.findUnique({ where: { id: fileId } })).name;
        const s3Instance = this.getS3Instance();
        const key = `${this.getS3Path()}${shareId}/${fileName}`;
        const response = await s3Instance.send(new client_s3_1.GetObjectCommand({
            Bucket: this.config.get("s3.bucketName"),
            Key: key,
        }));
        return {
            metaData: {
                id: fileId,
                size: response.ContentLength?.toString() || "0",
                name: fileName,
                shareId: shareId,
                createdAt: response.LastModified || new Date(),
                mimeType: mime.contentType(fileId.split(".").pop()) ||
                    "application/octet-stream",
            },
            file: response.Body,
        };
    }
    async remove(shareId, fileId) {
        const fileMetaData = await this.prisma.file.findUnique({
            where: { id: fileId },
        });
        if (!fileMetaData)
            throw new common_1.NotFoundException("File not found");
        const key = `${this.getS3Path()}${shareId}/${fileMetaData.name}`;
        const s3Instance = this.getS3Instance();
        try {
            await s3Instance.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.config.get("s3.bucketName"),
                Key: key,
            }));
        }
        catch (error) {
            throw new Error("Could not delete file from S3");
        }
        await this.prisma.file.delete({ where: { id: fileId } });
    }
    async deleteAllFiles(shareId) {
        const prefix = `${this.getS3Path()}${shareId}/`;
        const s3Instance = this.getS3Instance();
        try {
            const listResponse = await s3Instance.send(new client_s3_1.ListObjectsV2Command({
                Bucket: this.config.get("s3.bucketName"),
                Prefix: prefix,
            }));
            if (!listResponse.Contents || listResponse.Contents.length === 0) {
                throw new Error(`No files found for share ${shareId}`);
            }
            const objectsToDelete = listResponse.Contents.map((file) => ({
                Key: file.Key,
            }));
            await s3Instance.send(new client_s3_1.DeleteObjectsCommand({
                Bucket: this.config.get("s3.bucketName"),
                Delete: {
                    Objects: objectsToDelete,
                },
            }));
        }
        catch (error) {
            throw new Error("Could not delete all files from S3");
        }
    }
    async getFileSize(shareId, fileName) {
        const key = `${this.getS3Path()}${shareId}/${fileName}`;
        const s3Instance = this.getS3Instance();
        try {
            const headObjectResponse = await s3Instance.send(new client_s3_1.HeadObjectCommand({
                Bucket: this.config.get("s3.bucketName"),
                Key: key,
            }));
            return headObjectResponse.ContentLength ?? 0;
        }
        catch (error) {
            throw new Error("Could not retrieve file size");
        }
    }
    getS3Instance() {
        return new client_s3_1.S3Client({
            endpoint: this.config.get("s3.endpoint"),
            region: this.config.get("s3.region"),
            credentials: {
                accessKeyId: this.config.get("s3.key"),
                secretAccessKey: this.config.get("s3.secret"),
            },
            forcePathStyle: true,
        });
    }
    getZip() {
        throw new common_1.BadRequestException("ZIP download is not supported with S3 storage");
    }
    getS3Path() {
        const configS3Path = this.config.get("s3.bucketPath");
        return configS3Path ? `${configS3Path}/` : "";
    }
};
exports.S3FileService = S3FileService;
exports.S3FileService = S3FileService = S3FileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_service_1.ConfigService])
], S3FileService);
//# sourceMappingURL=s3.service.js.map