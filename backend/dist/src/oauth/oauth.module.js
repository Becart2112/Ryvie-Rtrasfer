"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthModule = void 0;
const common_1 = require("@nestjs/common");
const oauth_controller_1 = require("./oauth.controller");
const oauth_service_1 = require("./oauth.service");
const auth_module_1 = require("../auth/auth.module");
const github_provider_1 = require("./provider/github.provider");
const google_provider_1 = require("./provider/google.provider");
const oidc_provider_1 = require("./provider/oidc.provider");
const discord_provider_1 = require("./provider/discord.provider");
const microsoft_provider_1 = require("./provider/microsoft.provider");
let OAuthModule = class OAuthModule {
};
exports.OAuthModule = OAuthModule;
exports.OAuthModule = OAuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [oauth_controller_1.OAuthController],
        providers: [
            oauth_service_1.OAuthService,
            github_provider_1.GitHubProvider,
            google_provider_1.GoogleProvider,
            microsoft_provider_1.MicrosoftProvider,
            discord_provider_1.DiscordProvider,
            oidc_provider_1.OidcProvider,
            {
                provide: "OAUTH_PROVIDERS",
                useFactory(github, google, microsoft, discord, oidc) {
                    return {
                        github,
                        google,
                        microsoft,
                        discord,
                        oidc,
                    };
                },
                inject: [
                    github_provider_1.GitHubProvider,
                    google_provider_1.GoogleProvider,
                    microsoft_provider_1.MicrosoftProvider,
                    discord_provider_1.DiscordProvider,
                    oidc_provider_1.OidcProvider,
                ],
            },
            {
                provide: "OAUTH_PLATFORMS",
                useFactory(providers) {
                    return Object.keys(providers);
                },
                inject: ["OAUTH_PROVIDERS"],
            },
        ],
        imports: [(0, common_1.forwardRef)(() => auth_module_1.AuthModule)],
        exports: [oauth_service_1.OAuthService],
    })
], OAuthModule);
//# sourceMappingURL=oauth.module.js.map