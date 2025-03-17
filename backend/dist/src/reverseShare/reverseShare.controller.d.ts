import { User } from "@prisma/client";
import { ConfigService } from "src/config/config.service";
import { CreateReverseShareDTO } from "./dto/createReverseShare.dto";
import { ReverseShareDTO } from "./dto/reverseShare.dto";
import { ReverseShareTokenWithShares } from "./dto/reverseShareTokenWithShares";
import { ReverseShareService } from "./reverseShare.service";
export declare class ReverseShareController {
    private reverseShareService;
    private config;
    constructor(reverseShareService: ReverseShareService, config: ConfigService);
    create(body: CreateReverseShareDTO, user: User): Promise<{
        token: string;
        link: string;
    }>;
    getByToken(reverseShareToken: string): Promise<ReverseShareDTO>;
    getAllByUser(user: User): Promise<ReverseShareTokenWithShares[]>;
    remove(id: string): Promise<void>;
}
