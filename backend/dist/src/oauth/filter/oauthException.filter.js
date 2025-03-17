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
var OAuthExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../../config/config.service");
let OAuthExceptionFilter = OAuthExceptionFilter_1 = class OAuthExceptionFilter {
    constructor(config) {
        this.config = config;
        this.errorKeys = {
            access_denied: "access_denied",
            expired_token: "expired_token",
        };
        this.logger = new common_1.Logger(OAuthExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        this.logger.error(exception.message);
        this.logger.error("Request query: " + JSON.stringify(request.query, null, 2));
        const key = this.errorKeys[request.query.error] || "default";
        const url = new URL(`${this.config.get("general.appUrl")}/error`);
        url.searchParams.set("redirect", "/account");
        url.searchParams.set("error", key);
        response.redirect(url.toString());
    }
};
exports.OAuthExceptionFilter = OAuthExceptionFilter;
exports.OAuthExceptionFilter = OAuthExceptionFilter = OAuthExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], OAuthExceptionFilter);
//# sourceMappingURL=oauthException.filter.js.map