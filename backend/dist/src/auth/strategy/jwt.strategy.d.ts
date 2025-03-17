import { Strategy } from "passport-jwt";
import { ConfigService } from "src/config/config.service";
import { PrismaService } from "src/prisma/prisma.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    private static extractJWT;
    validate(payload: {
        sub: string;
    }): Promise<{
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
    }>;
}
export {};
