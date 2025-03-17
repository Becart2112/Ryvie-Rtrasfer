import { S3Client } from "@aws-sdk/client-s3";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "src/config/config.service";
import { File } from "./file.service";
export declare class S3FileService {
    private prisma;
    private config;
    private readonly logger;
    private multipartUploads;
    constructor(prisma: PrismaService, config: ConfigService);
    create(data: string, chunk: {
        index: number;
        total: number;
    }, file: {
        id?: string;
        name: string;
    }, shareId: string): Promise<{
        id?: string;
        name: string;
    }>;
    get(shareId: string, fileId: string): Promise<File>;
    remove(shareId: string, fileId: string): Promise<void>;
    deleteAllFiles(shareId: string): Promise<void>;
    getFileSize(shareId: string, fileName: string): Promise<number>;
    getS3Instance(): S3Client;
    getZip(): void;
    getS3Path(): string;
}
