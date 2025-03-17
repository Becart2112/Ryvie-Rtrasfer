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
exports.FileSecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
const prisma_service_1 = require("../../prisma/prisma.service");
const shareSecurity_guard_1 = require("../../share/guard/shareSecurity.guard");
const share_service_1 = require("../../share/share.service");
const config_service_1 = require("../../config/config.service");
let FileSecurityGuard = class FileSecurityGuard extends shareSecurity_guard_1.ShareSecurityGuard {
    constructor(_shareService, _prisma, _config) {
        super(_shareService, _prisma, _config);
        this._shareService = _shareService;
        this._prisma = _prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const shareId = Object.prototype.hasOwnProperty.call(request.params, "shareId")
            ? request.params.shareId
            : request.params.id;
        const shareToken = request.cookies[`share_${shareId}_token`];
        const share = await this._prisma.share.findUnique({
            where: { id: shareId },
            include: { security: true },
        });
        if (!shareToken) {
            if (!share ||
                (moment().isAfter(share.expiration) &&
                    !moment(share.expiration).isSame(0))) {
                throw new common_1.NotFoundException("File not found");
            }
            if (share.security?.password)
                throw new common_1.ForbiddenException("This share is password protected");
            if (share.security?.maxViews && share.security.maxViews <= share.views) {
                throw new common_1.ForbiddenException("Maximum views exceeded", "share_max_views_exceeded");
            }
            await this._shareService.increaseViewCount(share);
            return true;
        }
        else {
            return super.canActivate(context);
        }
    }
};
exports.FileSecurityGuard = FileSecurityGuard;
exports.FileSecurityGuard = FileSecurityGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [share_service_1.ShareService,
        prisma_service_1.PrismaService,
        config_service_1.ConfigService])
], FileSecurityGuard);
//# sourceMappingURL=fileSecurity.guard.js.map