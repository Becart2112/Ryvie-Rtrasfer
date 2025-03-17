import { ConfigService } from "src/config/config.service";
import { PrismaService } from "src/prisma/prisma.service";
export declare class LocalFileService {
    private prisma;
    private config;
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
    get(shareId: string, fileId: string): Promise<{
        metaData: {
            size: string;
            name: string;
            id: string;
            createdAt: Date;
            shareId: string;
            mimeType: string | false;
        };
        file: import("fs").ReadStream;
    }>;
    remove(shareId: string, fileId: string): Promise<void>;
    deleteAllFiles(shareId: string): Promise<void>;
    getZip(shareId: string): import("fs").ReadStream;
}
