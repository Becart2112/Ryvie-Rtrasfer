"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const email_module_1 = require("../email/email.module");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const authTotp_service_1 = require("./authTotp.service");
const jwt_strategy_1 = require("./strategy/jwt.strategy");
const ldap_service_1 = require("./ldap.service");
const user_module_1 = require("../user/user.module");
const oauth_module_1 = require("../oauth/oauth.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                global: true,
            }),
            email_module_1.EmailModule,
            (0, common_1.forwardRef)(() => oauth_module_1.OAuthModule),
            user_module_1.UserModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, authTotp_service_1.AuthTotpService, jwt_strategy_1.JwtStrategy, ldap_service_1.LdapService],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map