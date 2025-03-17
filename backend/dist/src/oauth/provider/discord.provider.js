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
exports.DiscordProvider = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../../config/config.service");
const errorPage_exception_1 = require("../exceptions/errorPage.exception");
let DiscordProvider = class DiscordProvider {
    constructor(config) {
        this.config = config;
    }
    getAuthEndpoint(state) {
        let scope = "identify email";
        if (this.config.get("oauth.discord-limitedGuild")) {
            scope += " guilds";
        }
        return Promise.resolve("https://discord.com/api/oauth2/authorize?" +
            new URLSearchParams({
                client_id: this.config.get("oauth.discord-clientId"),
                redirect_uri: this.config.get("general.appUrl") + "/api/oauth/callback/discord",
                response_type: "code",
                state,
                scope,
            }).toString());
    }
    getAuthorizationHeader() {
        return ("Basic " +
            Buffer.from(this.config.get("oauth.discord-clientId") +
                ":" +
                this.config.get("oauth.discord-clientSecret")).toString("base64"));
    }
    async getToken(query) {
        const res = await fetch("https://discord.com/api/v10/oauth2/token", {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: this.getAuthorizationHeader(),
            },
            body: new URLSearchParams({
                code: query.code,
                grant_type: "authorization_code",
                redirect_uri: this.config.get("general.appUrl") + "/api/oauth/callback/discord",
            }),
        });
        const token = (await res.json());
        return {
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresIn: token.expires_in,
            scope: token.scope,
            tokenType: token.token_type,
            rawToken: token,
        };
    }
    async getUserInfo(token) {
        const res = await fetch("https://discord.com/api/v10/users/@me", {
            method: "get",
            headers: {
                Accept: "application/json",
                Authorization: `${token.tokenType || "Bearer"} ${token.accessToken}`,
            },
        });
        const user = (await res.json());
        if (user.verified === false) {
            throw new errorPage_exception_1.ErrorPageException("unverified_account", undefined, [
                "provider_discord",
            ]);
        }
        const guild = this.config.get("oauth.discord-limitedGuild");
        if (guild) {
            await this.checkLimitedGuild(token, guild);
        }
        const limitedUsers = this.config.get("oauth.discord-limitedUsers");
        if (limitedUsers) {
            await this.checkLimitedUsers(user, limitedUsers);
        }
        return {
            provider: "discord",
            providerId: user.id,
            providerUsername: user.global_name ?? user.username,
            email: user.email,
            idToken: `discord:${token.idToken}`,
        };
    }
    async checkLimitedGuild(token, guildId) {
        try {
            const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
                method: "get",
                headers: {
                    Accept: "application/json",
                    Authorization: `${token.tokenType || "Bearer"} ${token.accessToken}`,
                },
            });
            const guilds = (await res.json());
            if (!guilds.some((guild) => guild.id === guildId)) {
                throw new errorPage_exception_1.ErrorPageException("user_not_allowed");
            }
        }
        catch {
            throw new errorPage_exception_1.ErrorPageException("user_not_allowed");
        }
    }
    async checkLimitedUsers(user, userIds) {
        if (!userIds.split(",").includes(user.id)) {
            throw new errorPage_exception_1.ErrorPageException("user_not_allowed");
        }
    }
};
exports.DiscordProvider = DiscordProvider;
exports.DiscordProvider = DiscordProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], DiscordProvider);
//# sourceMappingURL=discord.provider.js.map