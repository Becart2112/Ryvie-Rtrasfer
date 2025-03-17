import { StreamableFile } from "@nestjs/common";
import { Response } from "express";
import { FileService } from "./file.service";
export declare class FileController {
    private fileService;
    constructor(fileService: FileService);
    create(query: {
        id: string;
        name: string;
        chunkIndex: string;
        totalChunks: string;
    }, body: string, shareId: string): Promise<{
        id?: string;
        name: string;
    }>;
    getZip(res: Response, shareId: string): Promise<StreamableFile>;
    getFile(res: Response, shareId: string, fileId: string, download?: string): Promise<StreamableFile>;
    remove(fileId: string, shareId: string): Promise<void>;
}
