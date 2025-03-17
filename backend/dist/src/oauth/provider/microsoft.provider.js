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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftProvider = void 0;
const genericOidc_provider_1 = require("./genericOidc.provider");
const config_service_1 = require("../../config/config.service");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
let MicrosoftProvider = class MicrosoftProvider extends genericOidc_provider_1.GenericOidcProvider {
    constructor(config, jwtService, cache) {
        super("microsoft", ["oauth.microsoft-enabled", "oauth.microsoft-tenant"], config, jwtService, cache);
    }
    getDiscoveryUri() {
        return `https://login.microsoftonline.com/${this.config.get("oauth.microsoft-tenant")}/v2.0/.well-known/openid-configuration`;
    }
};
exports.MicrosoftProvider = MicrosoftProvider;
exports.MicrosoftProvider = MicrosoftProvider = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        jwt_1.JwtService, Object])
], MicrosoftProvider);
//# sourceMappingURL=microsoft.provider.js.map