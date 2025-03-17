import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { AdminShareDTO } from "./dto/adminShare.dto";
import { CreateShareDTO } from "./dto/createShare.dto";
import { MyShareDTO } from "./dto/myShare.dto";
import { ShareDTO } from "./dto/share.dto";
import { ShareMetaDataDTO } from "./dto/shareMetaData.dto";
import { SharePasswordDto } from "./dto/sharePassword.dto";
import { ShareService } from "./share.service";
import { CompletedShareDTO } from "./dto/shareComplete.dto";
export declare class ShareController {
    private shareService;
    private jwtService;
    constructor(shareService: ShareService, jwtService: JwtService);
    getAllShares(): Promise<AdminShareDTO[]>;
    getMyShares(user: User): Promise<MyShareDTO[]>;
    get(id: string): Promise<ShareDTO>;
    getFromOwner(id: string): Promise<ShareDTO>;
    getMetaData(id: string): Promise<ShareMetaDataDTO>;
    create(body: CreateShareDTO, request: Request, user: User): Promise<ShareDTO>;
    complete(id: string, request: Request): Promise<CompletedShareDTO>;
    revertComplete(id: string): Promise<ShareDTO>;
    remove(id: string, user: User): Promise<void>;
    isShareIdAvailable(id: string): Promise<{
        isAvailable: boolean;
    }>;
    getShareToken(id: string, request: Request, response: Response, body: SharePasswordDto): Promise<{
        token: string;
    }>;
    private clearShareTokenCookies;
}
