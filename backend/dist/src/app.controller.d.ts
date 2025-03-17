import { Response } from "express";
import { PrismaService } from "./prisma/prisma.service";
export declare class AppController {
    private prismaService;
    constructor(prismaService: PrismaService);
    health(res: Response): Promise<"OK" | "ERROR">;
}
