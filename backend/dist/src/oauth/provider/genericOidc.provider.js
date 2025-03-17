"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericOidcProvider = void 0;
const common_1 = require("@nestjs/common");
const jmespath = require("jmespath");
const nanoid_1 = require("nanoid");
const errorPage_exception_1 = require("../exceptions/errorPage.exception");
class GenericOidcProvider {
    constructor(name, keyOfConfigUpdateEvents, config, jwtService, cache) {
        this.name = name;
        this.keyOfConfigUpdateEvents = keyOfConfigUpdateEvents;
        this.config = config;
        this.jwtService = jwtService;
        this.cache = cache;
        this.logger = new common_1.Logger(Object.getPrototypeOf(this).constructor.name);
        this.discoveryUri = this.getDiscoveryUri();
        this.config.addListener("update", (key) => {
            if (this.keyOfConfigUpdateEvents.includes(key)) {
                this.deinit();
                this.discoveryUri = this.getDiscoveryUri();
            }
        });
    }
    getRedirectUri() {
        return `${this.config.get("general.appUrl")}/api/oauth/callback/${this.name}`;
    }
    async getConfiguration() {
        if (!this.configuration || this.configuration.expires < Date.now()) {
            await this.fetchConfiguration();
        }
        return this.configuration.data;
    }
    async getJwk() {
        if (!this.jwk || this.jwk.expires < Date.now()) {
            await this.fetchJwk();
        }
        return this.jwk.data;
    }
    async getAuthEndpoint(state) {
        const configuration = await this.getConfiguration();
        const endpoint = configuration.authorization_endpoint;
        const nonce = (0, nanoid_1.nanoid)();
        await this.cache.set(`oauth-${this.name}-nonce-${state}`, nonce, 1000 * 60 * 5);
        return (endpoint +
            "?" +
            new URLSearchParams({
                client_id: this.config.get(`oauth.${this.name}-clientId`),
                response_type: "code",
                scope: this.name == "oidc"
                    ? this.config.get(`oauth.oidc-scope`)
                    : "openid email profile",
                redirect_uri: this.getRedirectUri(),
                state,
                nonce,
            }).toString());
    }
    async getToken(query) {
        const configuration = await this.getConfiguration();
        const endpoint = configuration.token_endpoint;
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: this.config.get(`oauth.${this.name}-clientId`),
                client_secret: this.config.get(`oauth.${this.name}-clientSecret`),
                grant_type: "authorization_code",
                code: query.code,
                redirect_uri: this.getRedirectUri(),
            }).toString(),
        });
        const token = (await res.json());
        return {
            accessToken: token.access_token,
            expiresIn: token.expires_in,
            idToken: token.id_token,
            refreshToken: token.refresh_token,
            tokenType: token.token_type,
            rawToken: token,
        };
    }
    async getUserInfo(token, query, claim, roleConfig) {
        const idTokenData = this.decodeIdToken(token.idToken);
        if (!idTokenData) {
            this.logger.error(`Can not get ID Token from response ${JSON.stringify(token.rawToken, undefined, 2)}`);
            throw new common_1.InternalServerErrorException();
        }
        const key = `oauth-${this.name}-nonce-${query.state}`;
        const nonce = await this.cache.get(key);
        await this.cache.del(key);
        if (nonce !== idTokenData.nonce) {
            this.logger.error(`Invalid nonce. Expected ${nonce}, but got ${idTokenData.nonce}`);
            throw new errorPage_exception_1.ErrorPageException("invalid_token");
        }
        const username = claim
            ? idTokenData[claim]
            : idTokenData.preferred_username ||
                idTokenData.name ||
                idTokenData.nickname;
        let isAdmin;
        if (roleConfig?.path) {
            let roles = [];
            try {
                const rolesClaim = jmespath.search(idTokenData, roleConfig.path);
                if (Array.isArray(rolesClaim)) {
                    roles = rolesClaim;
                }
            }
            catch (e) {
                this.logger.warn(`Roles not found at path ${roleConfig.path} in ID Token ${JSON.stringify(idTokenData, undefined, 2)}`);
            }
            if (roleConfig.generalAccess &&
                !roles.includes(roleConfig.generalAccess)) {
                this.logger.error(`User roles ${roles} do not include ${roleConfig.generalAccess}`);
                throw new errorPage_exception_1.ErrorPageException("user_not_allowed");
            }
            if (roleConfig.adminAccess) {
                isAdmin = roles.includes(roleConfig.adminAccess);
            }
        }
        if (!username) {
            this.logger.error(`Can not get username from ID Token ${JSON.stringify(idTokenData, undefined, 2)}`);
            throw new errorPage_exception_1.ErrorPageException("cannot_get_user_info", undefined, [
                `provider_${this.name}`,
            ]);
        }
        return {
            provider: this.name,
            email: idTokenData.email,
            providerId: idTokenData.sub,
            providerUsername: username,
            ...(isAdmin !== undefined && { isAdmin }),
            idToken: `${this.name}:${token.idToken}`,
        };
    }
    async fetchConfiguration() {
        const res = await fetch(this.discoveryUri);
        const expires = res.headers.has("expires")
            ? new Date(res.headers.get("expires")).getTime()
            : Date.now() + 1000 * 60 * 60 * 24;
        this.configuration = {
            expires,
            data: (await res.json()),
        };
    }
    async fetchJwk() {
        const configuration = await this.getConfiguration();
        const res = await fetch(configuration.jwks_uri);
        const expires = res.headers.has("expires")
            ? new Date(res.headers.get("expires")).getTime()
            : Date.now() + 1000 * 60 * 60 * 24;
        this.jwk = {
            expires,
            data: (await res.json())["keys"],
        };
    }
    deinit() {
        this.discoveryUri = undefined;
        this.configuration = undefined;
        this.jwk = undefined;
    }
    decodeIdToken(idToken) {
        return this.jwtService.decode(idToken);
    }
}
exports.GenericOidcProvider = GenericOidcProvider;
//# sourceMappingURL=genericOidc.provider.js.map