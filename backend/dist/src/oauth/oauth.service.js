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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthService = void 0;
const common_1 = require("@nestjs/common");
const nanoid_1 = require("nanoid");
const auth_service_1 = require("../auth/auth.service");
const config_service_1 = require("../config/config.service");
const prisma_service_1 = require("../prisma/prisma.service");
const errorPage_exception_1 = require("./exceptions/errorPage.exception");
let OAuthService = OAuthService_1 = class OAuthService {
    constructor(prisma, config, auth, platforms, oAuthProviders) {
        this.prisma = prisma;
        this.config = config;
        this.auth = auth;
        this.platforms = platforms;
        this.oAuthProviders = oAuthProviders;
        this.logger = new common_1.Logger(OAuthService_1.name);
    }
    available() {
        return this.platforms
            .map((platform) => [
            platform,
            this.config.get(`oauth.${platform}-enabled`),
        ])
            .filter(([_, enabled]) => enabled)
            .map(([platform, _]) => platform);
    }
    availableProviders() {
        return Object.fromEntries(Object.entries(this.oAuthProviders)
            .map(([providerName, provider]) => [
            [providerName, provider],
            this.config.get(`oauth.${providerName}-enabled`),
        ])
            .filter(([_, enabled]) => enabled)
            .map(([provider, _]) => provider));
    }
    async status(user) {
        const oauthUsers = await this.prisma.oAuthUser.findMany({
            select: {
                provider: true,
                providerUsername: true,
            },
            where: {
                userId: user.id,
            },
        });
        return Object.fromEntries(oauthUsers.map((u) => [u.provider, u]));
    }
    async signIn(user, ip) {
        const oauthUser = await this.prisma.oAuthUser.findFirst({
            where: {
                provider: user.provider,
                providerUserId: user.providerId,
            },
        });
        if (oauthUser) {
            await this.updateIsAdmin(oauthUser.userId, user.isAdmin);
            const updatedUser = await this.prisma.user.findFirst({
                where: {
                    id: oauthUser.userId,
                },
            });
            this.logger.log(`Successful login for user ${user.email} from IP ${ip}`);
            return this.auth.generateToken(updatedUser, { idToken: user.idToken });
        }
        return this.signUp(user, ip);
    }
    async link(userId, provider, providerUserId, providerUsername) {
        const oauthUser = await this.prisma.oAuthUser.findFirst({
            where: {
                provider,
                providerUserId,
            },
        });
        if (oauthUser) {
            throw new errorPage_exception_1.ErrorPageException("already_linked", "/account", [
                `provider_${provider}`,
            ]);
        }
        await this.prisma.oAuthUser.create({
            data: {
                userId,
                provider,
                providerUsername,
                providerUserId,
            },
        });
    }
    async unlink(user, provider) {
        const oauthUser = await this.prisma.oAuthUser.findFirst({
            where: {
                userId: user.id,
                provider,
            },
        });
        if (oauthUser) {
            await this.prisma.oAuthUser.delete({
                where: {
                    id: oauthUser.id,
                },
            });
        }
        else {
            throw new errorPage_exception_1.ErrorPageException("not_linked", "/account", [provider]);
        }
    }
    async getAvailableUsername(preferredUsername) {
        let username = preferredUsername
            .replace(/[^a-zA-Z0-9._]/g, "")
            .substring(0, 20);
        while (true) {
            const user = await this.prisma.user.findFirst({
                where: {
                    username: username,
                },
            });
            if (user) {
                username = username + "_" + (0, nanoid_1.nanoid)(10).replaceAll("-", "");
            }
            else {
                return username;
            }
        }
    }
    async signUp(user, ip) {
        if (!this.config.get("oauth.allowRegistration")) {
            throw new errorPage_exception_1.ErrorPageException("no_user", "/auth/signIn", [
                `provider_${user.provider}`,
            ]);
        }
        if (!user.email) {
            throw new errorPage_exception_1.ErrorPageException("no_email", "/auth/signIn", [
                `provider_${user.provider}`,
            ]);
        }
        const existingUser = await this.prisma.user.findFirst({
            where: {
                email: user.email,
            },
        });
        if (existingUser) {
            await this.prisma.oAuthUser.create({
                data: {
                    provider: user.provider,
                    providerUserId: user.providerId.toString(),
                    providerUsername: user.providerUsername,
                    userId: existingUser.id,
                },
            });
            await this.updateIsAdmin(existingUser.id, user.isAdmin);
            return this.auth.generateToken(existingUser, { idToken: user.idToken });
        }
        const result = await this.auth.signUp({
            email: user.email,
            username: await this.getAvailableUsername(user.providerUsername),
            password: null,
        }, ip, user.isAdmin);
        await this.prisma.oAuthUser.create({
            data: {
                provider: user.provider,
                providerUserId: user.providerId.toString(),
                providerUsername: user.providerUsername,
                userId: result.user.id,
            },
        });
        return result;
    }
    async updateIsAdmin(userId, isAdmin) {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isAdmin: isAdmin === true,
            },
        });
    }
};
exports.OAuthService = OAuthService;
exports.OAuthService = OAuthService = OAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(3, (0, common_1.Inject)("OAUTH_PLATFORMS")),
    __param(4, (0, common_1.Inject)("OAUTH_PROVIDERS")),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_service_1.ConfigService,
        auth_service_1.AuthService, Array, Object])
], OAuthService);
//# sourceMappingURL=oauth.service.js.map