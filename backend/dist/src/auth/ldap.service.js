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
var LdapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LdapService = void 0;
const common_1 = require("@nestjs/common");
const node_util_1 = require("node:util");
const config_service_1 = require("../config/config.service");
const ldapts_1 = require("ldapts");
let LdapService = LdapService_1 = class LdapService {
    constructor(serviceConfig) {
        this.serviceConfig = serviceConfig;
        this.logger = new common_1.Logger(LdapService_1.name);
    }
    async createLdapConnection() {
        const ldapUrl = this.serviceConfig.get("ldap.url");
        if (!ldapUrl) {
            throw new Error("LDAP server URL is not defined");
        }
        const ldapClient = new ldapts_1.Client({
            url: ldapUrl,
            timeout: 15_000,
            connectTimeout: 15_000,
        });
        const bindDn = this.serviceConfig.get("ldap.bindDn") || null;
        if (bindDn) {
            try {
                await ldapClient.bind(bindDn, this.serviceConfig.get("ldap.bindPassword"));
            }
            catch (error) {
                this.logger.warn(`Failed to bind to default user: ${error}`);
                throw new Error("failed to bind to default user");
            }
        }
        return ldapClient;
    }
    async authenticateUser(username, password) {
        if (!username.match(/^[a-zA-Z0-9-_.@]+$/)) {
            this.logger.verbose(`Username ${username} does not match username pattern. Authentication failed.`);
            return null;
        }
        const searchBase = this.serviceConfig.get("ldap.searchBase");
        const searchQuery = this.serviceConfig
            .get("ldap.searchQuery")
            .replaceAll("%username%", username);
        const ldapClient = await this.createLdapConnection();
        try {
            const { searchEntries } = await ldapClient.search(searchBase, {
                filter: searchQuery,
                scope: "sub",
                attributes: ["*"],
                returnAttributeValues: true,
            });
            if (searchEntries.length > 1) {
                this.logger.verbose(`Authentication for username ${username} failed. Too many users found with query ${searchQuery}`);
                return null;
            }
            else if (searchEntries.length == 0) {
                this.logger.verbose(`Authentication for username ${username} failed. No user found with query ${searchQuery}`);
                return null;
            }
            const targetEntity = searchEntries[0];
            this.logger.verbose(`Trying to authenticate ${username} against LDAP user ${targetEntity.dn}`);
            try {
                await ldapClient.bind(targetEntity.dn, password);
                return targetEntity;
            }
            catch (error) {
                if (error instanceof ldapts_1.InvalidCredentialsError) {
                    this.logger.verbose(`Failed to authenticate ${username} against ${targetEntity.dn}. Invalid credentials.`);
                    return null;
                }
                this.logger.warn(`User bind failure: ${(0, node_util_1.inspect)(error)}`);
                return null;
            }
        }
        catch (error) {
            this.logger.warn(`Connect error: ${(0, node_util_1.inspect)(error)}`);
            return null;
        }
    }
};
exports.LdapService = LdapService;
exports.LdapService = LdapService = LdapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(config_service_1.ConfigService)),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], LdapService);
//# sourceMappingURL=ldap.service.js.map