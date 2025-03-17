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
exports.ShareOwnerGuard = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../../config/config.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_guard_1 = require("../../auth/guard/jwt.guard");
let ShareOwnerGuard = class ShareOwnerGuard extends jwt_guard_1.JwtGuard {
    constructor(configService, prisma) {
        super(configService);
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const shareId = Object.prototype.hasOwnProperty.call(request.params, "shareId")
            ? request.params.shareId
            : request.params.id;
        const share = await this.prisma.share.findUnique({
            where: { id: shareId },
            include: { security: true },
        });
        if (!share)
            throw new common_1.NotFoundException("Share not found");
        await super.canActivate(context);
        const user = request.user;
        if (user?.isAdmin)
            return true;
        if (!share.creatorId)
            return true;
        if (!user)
            return false;
        return share.creatorId == user.id;
    }
};
exports.ShareOwnerGuard = ShareOwnerGuard;
exports.ShareOwnerGuard = ShareOwnerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        prisma_service_1.PrismaService])
], ShareOwnerGuard);
//# sourceMappingURL=shareOwner.guard.js.map