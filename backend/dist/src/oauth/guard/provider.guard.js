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
exports.ProviderGuard = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../../config/config.service");
let ProviderGuard = class ProviderGuard {
    constructor(config, platforms) {
        this.config = config;
        this.platforms = platforms;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const provider = request.params.provider;
        return (this.platforms.includes(provider) &&
            this.config.get(`oauth.${provider}-enabled`));
    }
};
exports.ProviderGuard = ProviderGuard;
exports.ProviderGuard = ProviderGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)("OAUTH_PLATFORMS")),
    __metadata("design:paramtypes", [config_service_1.ConfigService, Array])
], ProviderGuard);
//# sourceMappingURL=provider.guard.js.map