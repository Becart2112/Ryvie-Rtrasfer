import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { ConfigService } from "src/config/config.service";
import { EmailService } from "src/email/email.service";
import { PrismaService } from "src/prisma/prisma.service";
import { OAuthService } from "../oauth/oauth.service";
import { UserSevice } from "../user/user.service";
import { AuthRegisterDTO } from "./dto/authRegister.dto";
import { AuthSignInDTO } from "./dto/authSignIn.dto";
import { LdapService } from "./ldap.service";
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    private emailService;
    private ldapService;
    private userService;
    private oAuthService;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService, emailService: EmailService, ldapService: LdapService, userService: UserSevice, oAuthService: OAuthService);
    private readonly logger;
    signUp(dto: AuthRegisterDTO, ip: string, isAdmin?: boolean): Promise<{
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
    }>;
    signIn(dto: AuthSignInDTO, ip: string): Promise<{
        loginToken: string;
        accessToken?: undefined;
        refreshToken?: undefined;
    } | {
        accessToken: string;
        refreshToken: string;
        loginToken?: undefined;
    }>;
    generateToken(user: User, oauth?: {
        idToken?: string;
    }): Promise<{
        loginToken: string;
        accessToken?: undefined;
        refreshToken?: undefined;
    } | {
        accessToken: string;
        refreshToken: string;
        loginToken?: undefined;
    }>;
    requestResetPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    updatePassword(user: User, newPassword: string, oldPassword?: string): Promise<{
        refreshTokenId: string;
        refreshToken: string;
    }>;
    createAccessToken(user: User, refreshTokenId: string): Promise<string>;
    signOut(accessToken: string): Promise<string>;
    refreshAccessToken(refreshToken: string): Promise<string>;
    createRefreshToken(userId: string, idToken?: string): Promise<{
        refreshTokenId: string;
        refreshToken: string;
    }>;
    createLoginToken(userId: string): Promise<string>;
    addTokensToResponse(response: Response, refreshToken?: string, accessToken?: string): void;
    getIdOfCurrentUser(request: Request): Promise<string | null>;
    verifyPassword(user: User, password: string): Promise<boolean>;
}
