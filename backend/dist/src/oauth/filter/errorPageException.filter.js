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
var ErrorPageExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorPageExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../../config/config.service");
const errorPage_exception_1 = require("../exceptions/errorPage.exception");
let ErrorPageExceptionFilter = ErrorPageExceptionFilter_1 = class ErrorPageExceptionFilter {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(ErrorPageExceptionFilter_1.name);
    }
    catch(exception, host) {
        this.logger.error(JSON.stringify({
            error: exception.key,
            params: exception.params,
            redirect: exception.redirect,
        }));
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const url = new URL(`${this.config.get("general.appUrl")}/error`);
        url.searchParams.set("error", exception.key);
        if (exception.redirect) {
            url.searchParams.set("redirect", exception.redirect);
        }
        else {
            const redirect = ctx.getRequest().cookies.access_token
                ? "/account"
                : "/auth/signIn";
            url.searchParams.set("redirect", redirect);
        }
        if (exception.params) {
            url.searchParams.set("params", exception.params.join(","));
        }
        response.redirect(url.toString());
    }
};
exports.ErrorPageExceptionFilter = ErrorPageExceptionFilter;
exports.ErrorPageExceptionFilter = ErrorPageExceptionFilter = ErrorPageExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(errorPage_exception_1.ErrorPageException),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], ErrorPageExceptionFilter);
//# sourceMappingURL=errorPageException.filter.js.map