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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const library_1 = require("@prisma/client/runtime/library");
const argon = require("argon2");
const moment = require("moment");
const config_service_1 = require("../config/config.service");
const email_service_1 = require("../email/email.service");
const prisma_service_1 = require("../prisma/prisma.service");
const oauth_service_1 = require("../oauth/oauth.service");
const genericOidc_provider_1 = require("../oauth/provider/genericOidc.provider");
const user_service_1 = require("../user/user.service");
const ldap_service_1 = require("./ldap.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, config, emailService, ldapService, userService, oAuthService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
        this.emailService = emailService;
        this.ldapService = ldapService;
        this.userService = userService;
        this.oAuthService = oAuthService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async signUp(dto, ip, isAdmin) {
        const isFirstUser = (await this.prisma.user.count()) == 0;
        const hash = dto.password ? await argon.hash(dto.password) : null;
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    username: dto.username,
                    password: hash,
                    isAdmin: isAdmin ?? isFirstUser,
                },
            });
            const { refreshToken, refreshTokenId } = await this.createRefreshToken(user.id);
            const accessToken = await this.createAccessToken(user, refreshTokenId);
            this.logger.log(`User ${user.email} signed up from IP ${ip}`);
            return { accessToken, refreshToken, user };
        }
        catch (e) {
            if (e instanceof library_1.PrismaClientKnownRequestError) {
                if (e.code == "P2002") {
                    const duplicatedField = e.meta.target[0];
                    throw new common_1.BadRequestException(`A user with this ${duplicatedField} already exists`);
                }
            }
        }
    }
    async signIn(dto, ip) {
        if (!dto.email && !dto.username) {
            throw new common_1.BadRequestException("Email or username is required");
        }
        if (!this.config.get("oauth.disablePassword")) {
            const user = await this.prisma.user.findFirst({
                where: {
                    OR: [{ email: dto.email }, { username: dto.username }],
                },
            });
            if (user?.password && (await argon.verify(user.password, dto.password))) {
                this.logger.log(`Successful password login for user ${user.email} from IP ${ip}`);
                return this.generateToken(user);
            }
        }
        if (this.config.get("ldap.enabled")) {
            const ldapUsername = dto.username || dto.email;
            this.logger.debug(`Trying LDAP login for user ${ldapUsername}`);
            const ldapUser = await this.ldapService.authenticateUser(ldapUsername, dto.password);
            if (ldapUser) {
                const user = await this.userService.findOrCreateFromLDAP(dto, ldapUser);
                this.logger.log(`Successful LDAP login for user ${ldapUsername} (${user.id}) from IP ${ip}`);
                return this.generateToken(user);
            }
        }
        this.logger.log(`Failed login attempt for user ${dto.email || dto.username} from IP ${ip}`);
        throw new common_1.UnauthorizedException("Wrong email or password");
    }
    async generateToken(user, oauth) {
        if (user.totpVerified && !(oauth && this.config.get("oauth.ignoreTotp"))) {
            const loginToken = await this.createLoginToken(user.id);
            return { loginToken };
        }
        const { refreshToken, refreshTokenId } = await this.createRefreshToken(user.id, oauth?.idToken);
        const accessToken = await this.createAccessToken(user, refreshTokenId);
        return { accessToken, refreshToken };
    }
    async requestResetPassword(email) {
        if (this.config.get("oauth.disablePassword"))
            throw new common_1.ForbiddenException("Password sign in is disabled");
        const user = await this.prisma.user.findFirst({
            where: { email },
            include: { resetPasswordToken: true },
        });
        if (!user)
            return;
        if (user.ldapDN) {
            this.logger.log(`Failed password reset request for user ${email} because it is an LDAP user`);
            throw new common_1.BadRequestException("This account can't reset its password here. Please contact your administrator.");
        }
        if (user.resetPasswordToken) {
            await this.prisma.resetPasswordToken.delete({
                where: { token: user.resetPasswordToken.token },
            });
        }
        const { token } = await this.prisma.resetPasswordToken.create({
            data: {
                expiresAt: moment().add(1, "hour").toDate(),
                user: { connect: { id: user.id } },
            },
        });
        this.emailService.sendResetPasswordEmail(user.email, token);
    }
    async resetPassword(token, newPassword) {
        if (this.config.get("oauth.disablePassword"))
            throw new common_1.ForbiddenException("Password sign in is disabled");
        const user = await this.prisma.user.findFirst({
            where: { resetPasswordToken: { token } },
        });
        if (!user)
            throw new common_1.BadRequestException("Token invalid or expired");
        const newPasswordHash = await argon.hash(newPassword);
        await this.prisma.resetPasswordToken.delete({
            where: { token },
        });
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: newPasswordHash },
        });
    }
    async updatePassword(user, newPassword, oldPassword) {
        const isPasswordValid = !user.password || (await argon.verify(user.password, oldPassword));
        if (!isPasswordValid)
            throw new common_1.ForbiddenException("Invalid password");
        const hash = await argon.hash(newPassword);
        await this.prisma.refreshToken.deleteMany({
            where: { userId: user.id },
        });
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hash },
        });
        return this.createRefreshToken(user.id);
    }
    async createAccessToken(user, refreshTokenId) {
        return this.jwtService.sign({
            sub: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
            refreshTokenId,
        }, {
            expiresIn: "15min",
            secret: this.config.get("internal.jwtSecret"),
        });
    }
    async signOut(accessToken) {
        const { refreshTokenId } = this.jwtService.decode(accessToken) || {};
        if (refreshTokenId) {
            const oauthIDToken = await this.prisma.refreshToken
                .findFirst({
                select: { oauthIDToken: true },
                where: { id: refreshTokenId },
            })
                .then((refreshToken) => refreshToken?.oauthIDToken)
                .catch((e) => {
                if (e.code != "P2025")
                    throw e;
            });
            await this.prisma.refreshToken
                .delete({ where: { id: refreshTokenId } })
                .catch((e) => {
                if (e.code != "P2025")
                    throw e;
            });
            if (typeof oauthIDToken === "string") {
                const [providerName, idTokenHint] = oauthIDToken.split(":");
                const provider = this.oAuthService.availableProviders()[providerName];
                let signOutFromProviderSupportedAndActivated = false;
                try {
                    signOutFromProviderSupportedAndActivated = this.config.get(`oauth.${providerName}-signOut`);
                }
                catch (_) {
                }
                if (provider instanceof genericOidc_provider_1.GenericOidcProvider &&
                    signOutFromProviderSupportedAndActivated) {
                    const configuration = await provider.getConfiguration();
                    if (URL.canParse(configuration.end_session_endpoint)) {
                        const redirectURI = new URL(configuration.end_session_endpoint);
                        redirectURI.searchParams.append("post_logout_redirect_uri", this.config.get("general.appUrl"));
                        redirectURI.searchParams.append("id_token_hint", idTokenHint);
                        redirectURI.searchParams.append("client_id", this.config.get(`oauth.${providerName}-clientId`));
                        return redirectURI.toString();
                    }
                }
            }
        }
    }
    async refreshAccessToken(refreshToken) {
        const refreshTokenMetaData = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!refreshTokenMetaData || refreshTokenMetaData.expiresAt < new Date())
            throw new common_1.UnauthorizedException();
        return this.createAccessToken(refreshTokenMetaData.user, refreshTokenMetaData.id);
    }
    async createRefreshToken(userId, idToken) {
        const sessionDuration = this.config.get("general.sessionDuration");
        const { id, token } = await this.prisma.refreshToken.create({
            data: {
                userId,
                expiresAt: moment()
                    .add(sessionDuration.value, sessionDuration.unit)
                    .toDate(),
                oauthIDToken: idToken,
            },
        });
        return { refreshTokenId: id, refreshToken: token };
    }
    async createLoginToken(userId) {
        const loginToken = (await this.prisma.loginToken.create({
            data: { userId, expiresAt: moment().add(5, "minutes").toDate() },
        })).token;
        return loginToken;
    }
    addTokensToResponse(response, refreshToken, accessToken) {
        const isSecure = this.config.get("general.secureCookies");
        if (accessToken)
            response.cookie("access_token", accessToken, {
                sameSite: "lax",
                secure: isSecure,
                maxAge: 1000 * 60 * 60 * 24 * 30 * 3,
            });
        if (refreshToken) {
            const now = moment();
            const sessionDuration = this.config.get("general.sessionDuration");
            const maxAge = moment(now)
                .add(sessionDuration.value, sessionDuration.unit)
                .diff(now);
            response.cookie("refresh_token", refreshToken, {
                path: "/api/auth/token",
                httpOnly: true,
                sameSite: "strict",
                secure: isSecure,
                maxAge,
            });
        }
    }
    async getIdOfCurrentUser(request) {
        if (!request.cookies.access_token)
            return null;
        try {
            const payload = await this.jwtService.verifyAsync(request.cookies.access_token, {
                secret: this.config.get("internal.jwtSecret"),
            });
            return payload.sub;
        }
        catch {
            return null;
        }
    }
    async verifyPassword(user, password) {
        if (!user.password && this.config.get("ldap.enabled")) {
            return !!this.ldapService.authenticateUser(user.username, password);
        }
        return argon.verify(user.password, password);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => oauth_service_1.OAuthService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_service_1.ConfigService,
        email_service_1.EmailService,
        ldap_service_1.LdapService,
        user_service_1.UserSevice,
        oauth_service_1.OAuthService])
], AuthService);
//# sourceMappingURL=auth.service.js.map