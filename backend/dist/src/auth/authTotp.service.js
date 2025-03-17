"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTotpService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const qrcode = require("qrcode-svg");
const config_service_1 = require("../config/config.service");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("./auth.service");
let AuthTotpService = class AuthTotpService {
    constructor(prisma, configService, authService) {
        this.prisma = prisma;
        this.configService = configService;
        this.authService = authService;
    }
    async signInTotp(dto) {
        const token = await this.prisma.loginToken.findFirst({
            where: {
                token: dto.loginToken,
            },
            include: {
                user: true,
            },
        });
        if (!token || token.used)
            throw new common_1.UnauthorizedException("Invalid login token");
        if (token.expiresAt < new Date())
            throw new common_1.UnauthorizedException("Login token expired", "token_expired");
        const { totpSecret } = token.user;
        if (!totpSecret) {
            throw new common_1.BadRequestException("TOTP is not enabled");
        }
        if (!otplib_1.authenticator.check(dto.totp, totpSecret)) {
            throw new common_1.BadRequestException("Invalid code");
        }
        await this.prisma.loginToken.update({
            where: { token: token.token },
            data: { used: true },
        });
        const { refreshToken, refreshTokenId } = await this.authService.createRefreshToken(token.user.id);
        const accessToken = await this.authService.createAccessToken(token.user, refreshTokenId);
        return { accessToken, refreshToken };
    }
    async enableTotp(user, password) {
        if (!this.authService.verifyPassword(user, password))
            throw new common_1.ForbiddenException("Invalid password");
        const { totpVerified } = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: { totpVerified: true },
        });
        if (totpVerified) {
            throw new common_1.BadRequestException("TOTP is already enabled");
        }
        const issuer = this.configService.get("general.appName");
        const secret = otplib_1.authenticator.generateSecret();
        const otpURL = otplib_1.totp.keyuri(user.username || user.email, issuer, secret);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                totpEnabled: true,
                totpSecret: secret,
            },
        });
        const qrCode = new qrcode({
            content: otpURL,
            container: "svg-viewbox",
            join: true,
        }).svg();
        return {
            totpAuthUrl: otpURL,
            totpSecret: secret,
            qrCode: "data:image/svg+xml;base64," + Buffer.from(qrCode).toString("base64"),
        };
    }
    async verifyTotp(user, password, code) {
        if (!this.authService.verifyPassword(user, password))
            throw new common_1.ForbiddenException("Invalid password");
        const { totpSecret } = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: { totpSecret: true },
        });
        if (!totpSecret) {
            throw new common_1.BadRequestException("TOTP is not in progress");
        }
        const expected = otplib_1.authenticator.generate(totpSecret);
        if (code !== expected) {
            throw new common_1.BadRequestException("Invalid code");
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                totpVerified: true,
            },
        });
        return true;
    }
    async disableTotp(user, password, code) {
        if (!this.authService.verifyPassword(user, password))
            throw new common_1.ForbiddenException("Invalid password");
        const { totpSecret } = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: { totpSecret: true },
        });
        if (!totpSecret) {
            throw new common_1.BadRequestException("TOTP is not enabled");
        }
        const expected = otplib_1.authenticator.generate(totpSecret);
        if (code !== expected) {
            throw new common_1.BadRequestException("Invalid code");
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                totpVerified: false,
                totpEnabled: false,
                totpSecret: null,
            },
        });
        return true;
    }
};
exports.AuthTotpService = AuthTotpService;
exports.AuthTotpService = AuthTotpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_service_1.ConfigService,
        auth_service_1.AuthService])
], AuthTotpService);
//# sourceMappingURL=authTotp.service.js.map