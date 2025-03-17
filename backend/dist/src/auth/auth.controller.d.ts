import { User } from "@prisma/client";
import { Request, Response } from "express";
import { ConfigService } from "src/config/config.service";
import { AuthService } from "./auth.service";
import { AuthTotpService } from "./authTotp.service";
import { AuthRegisterDTO } from "./dto/authRegister.dto";
import { AuthSignInDTO } from "./dto/authSignIn.dto";
import { AuthSignInTotpDTO } from "./dto/authSignInTotp.dto";
import { EnableTotpDTO } from "./dto/enableTotp.dto";
import { ResetPasswordDTO } from "./dto/resetPassword.dto";
import { TokenDTO } from "./dto/token.dto";
import { UpdatePasswordDTO } from "./dto/updatePassword.dto";
import { VerifyTotpDTO } from "./dto/verifyTotp.dto";
export declare class AuthController {
    private authService;
    private authTotpService;
    private config;
    constructor(authService: AuthService, authTotpService: AuthTotpService, config: ConfigService);
    signUp(dto: AuthRegisterDTO, { ip }: Request, response: Response): Promise<{
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
    signIn(dto: AuthSignInDTO, { ip }: Request, response: Response): Promise<{
        loginToken: string;
        accessToken?: undefined;
        refreshToken?: undefined;
    } | {
        accessToken: string;
        refreshToken: string;
        loginToken?: undefined;
    }>;
    signInTotp(dto: AuthSignInTotpDTO, response: Response): Promise<TokenDTO>;
    requestResetPassword(email: string): Promise<void>;
    resetPassword(dto: ResetPasswordDTO): Promise<void>;
    updatePassword(user: User, response: Response, dto: UpdatePasswordDTO): Promise<TokenDTO>;
    refreshAccessToken(request: Request, response: Response): Promise<TokenDTO>;
    signOut(request: Request, response: Response): Promise<{
        redirectURI: string;
    }>;
    enableTotp(user: User, body: EnableTotpDTO): Promise<{
        totpAuthUrl: string;
        totpSecret: string;
        qrCode: string;
    }>;
    verifyTotp(user: User, body: VerifyTotpDTO): Promise<boolean>;
    disableTotp(user: User, body: VerifyTotpDTO): Promise<boolean>;
}
