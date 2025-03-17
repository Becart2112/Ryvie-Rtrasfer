import { LocalFileService } from "./local.service";
import { S3FileService } from "./s3.service";
import { ConfigService } from "src/config/config.service";
import { Readable } from "stream";
import { PrismaService } from "../prisma/prisma.service";
export declare class FileService {
    private prisma;
    private localFileService;
    private s3FileService;
    private configService;
    constructor(prisma: PrismaService, localFileService: LocalFileService, s3FileService: S3FileService, configService: ConfigService);
    private getStorageService;
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
    getZip(shareId: string): Readable;
    private streamToUint8Array;
}
export interface File {
    metaData: {
        id: string;
        size: string;
        createdAt: Date;
        mimeType: string | false;
        name: string;
        shareId: string;
    };
    file: Readable;
}
