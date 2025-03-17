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
exports.CreateShareGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../../auth/guard/jwt.guard");
const config_service_1 = require("../../config/config.service");
const reverseShare_service_1 = require("../../reverseShare/reverseShare.service");
let CreateShareGuard = class CreateShareGuard extends jwt_guard_1.JwtGuard {
    constructor(configService, reverseShareService) {
        super(configService);
        this.reverseShareService = reverseShareService;
    }
    async canActivate(context) {
        if (await super.canActivate(context))
            return true;
        const reverseShareTokenId = context.switchToHttp().getRequest()
            .cookies.reverse_share_token;
        if (!reverseShareTokenId)
            return false;
        const isReverseShareTokenValid = await this.reverseShareService.isValid(reverseShareTokenId);
        return isReverseShareTokenValid;
    }
};
exports.CreateShareGuard = CreateShareGuard;
exports.CreateShareGuard = CreateShareGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        reverseShare_service_1.ReverseShareService])
], CreateShareGuard);
//# sourceMappingURL=createShare.guard.js.map