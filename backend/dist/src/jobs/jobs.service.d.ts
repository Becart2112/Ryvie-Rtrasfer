import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ReverseShareService } from "src/reverseShare/reverseShare.service";
export declare class JobsService {
    private prisma;
    private reverseShareService;
    private fileService;
    private readonly logger;
    constructor(prisma: PrismaService, reverseShareService: ReverseShareService, fileService: FileService);
    deleteExpiredShares(): Promise<void>;
    deleteExpiredReverseShares(): Promise<void>;
    deleteUnfinishedShares(): Promise<void>;
    deleteTemporaryFiles(): void;
    deleteExpiredTokens(): Promise<void>;
}
