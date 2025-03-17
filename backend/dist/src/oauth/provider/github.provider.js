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
exports.GitHubProvider = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../../config/config.service");
const errorPage_exception_1 = require("../exceptions/errorPage.exception");
let GitHubProvider = class GitHubProvider {
    constructor(config) {
        this.config = config;
    }
    getAuthEndpoint(state) {
        return Promise.resolve("https://github.com/login/oauth/authorize?" +
            new URLSearchParams({
                client_id: this.config.get("oauth.github-clientId"),
                redirect_uri: this.config.get("general.appUrl") + "/api/oauth/callback/github",
                state: state,
                scope: "user:email",
            }).toString());
    }
    async getToken(query) {
        const res = await fetch("https://github.com/login/oauth/access_token?" +
            new URLSearchParams({
                client_id: this.config.get("oauth.github-clientId"),
                client_secret: this.config.get("oauth.github-clientSecret"),
                code: query.code,
            }).toString(), {
            method: "post",
            headers: {
                Accept: "application/json",
            },
        });
        const token = (await res.json());
        return {
            accessToken: token.access_token,
            tokenType: token.token_type,
            scope: token.scope,
            rawToken: token,
        };
    }
    async getUserInfo(token) {
        if (!token.scope.includes("user:email")) {
            throw new errorPage_exception_1.ErrorPageException("no_email", undefined, ["provider_github"]);
        }
        const user = await this.getGitHubUser(token);
        const email = await this.getGitHubEmail(token);
        if (!email) {
            throw new errorPage_exception_1.ErrorPageException("no_email", undefined, ["provider_github"]);
        }
        return {
            provider: "github",
            providerId: user.id.toString(),
            providerUsername: user.name ?? user.login,
            email,
            idToken: `github:${token.idToken}`,
        };
    }
    async getGitHubUser(token) {
        const res = await fetch("https://api.github.com/user", {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `${token.tokenType ?? "Bearer"} ${token.accessToken}`,
            },
        });
        return (await res.json());
    }
    async getGitHubEmail(token) {
        const res = await fetch("https://api.github.com/user/public_emails", {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `${token.tokenType ?? "Bearer"} ${token.accessToken}`,
            },
        });
        const emails = (await res.json());
        return emails.find((e) => e.primary && e.verified)?.email;
    }
};
exports.GitHubProvider = GitHubProvider;
exports.GitHubProvider = GitHubProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], GitHubProvider);
//# sourceMappingURL=github.provider.js.map