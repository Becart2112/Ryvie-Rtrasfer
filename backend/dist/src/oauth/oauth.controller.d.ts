import { User } from "@prisma/client";
import { Request, Response } from "express";
import { AuthService } from "../auth/auth.service";
import { ConfigService } from "../config/config.service";
import { OAuthCallbackDto } from "./dto/oauthCallback.dto";
import { OAuthService } from "./oauth.service";
import { OAuthProvider } from "./provider/oauthProvider.interface";
export declare class OAuthController {
    private authService;
    private oauthService;
    private config;
    private providers;
    constructor(authService: AuthService, oauthService: OAuthService, config: ConfigService, providers: Record<string, OAuthProvider<unknown>>);
    available(): string[];
    status(user: User): Promise<{
        [k: string]: {
            provider: string;
            providerUsername: string;
        };
    }>;
    auth(provider: string, response: Response): Promise<void>;
    callback(provider: string, query: OAuthCallbackDto, request: Request, response: Response): Promise<void>;
    unlink(user: User, provider: string): Promise<void>;
}
