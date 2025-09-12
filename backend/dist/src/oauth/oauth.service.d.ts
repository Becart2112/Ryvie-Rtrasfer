import { User } from "@prisma/client";
import { AuthService } from "../auth/auth.service";
import { ConfigService } from "../config/config.service";
import { PrismaService } from "../prisma/prisma.service";
import { OAuthSignInDto } from "./dto/oauthSignIn.dto";
import { OAuthProvider } from "./provider/oauthProvider.interface";
export declare class OAuthService {
    private prisma;
    private config;
    private auth;
    private platforms;
    private oAuthProviders;
    constructor(prisma: PrismaService, config: ConfigService, auth: AuthService, platforms: string[], oAuthProviders: Record<string, OAuthProvider<unknown>>);
    private readonly logger;
    available(): string[];
    availableProviders(): Record<string, OAuthProvider<unknown>>;
    status(user: User): Promise<{
        [k: string]: {
            provider: string;
            providerUsername: string;
        };
    }>;
    signIn(user: OAuthSignInDto, ip: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            updatedAt: Date;
            email: string;
            username: string;
            password: string | null;
            id: string;
            createdAt: Date;
            isAdmin: boolean;
            ldapDN: string | null;
            totpEnabled: boolean;
            totpVerified: boolean;
            totpSecret: string | null;
        };
    } | {
        loginToken: string;
        accessToken?: undefined;
        refreshToken?: undefined;
    } | {
        accessToken: string;
        refreshToken: string;
        loginToken?: undefined;
    }>;
    link(userId: string, provider: string, providerUserId: string, providerUsername: string): Promise<void>;
    unlink(user: User, provider: string): Promise<void>;
    private getAvailableUsername;
    private signUp;
    private updateIsAdmin;
}
