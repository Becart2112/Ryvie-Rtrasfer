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
var UserSevice_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSevice = void 0;
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
const argon = require("argon2");
const crypto = require("crypto");
const email_service_1 = require("../email/email.service");
const prisma_service_1 = require("../prisma/prisma.service");
const util_1 = require("util");
const config_service_1 = require("../config/config.service");
const file_service_1 = require("../file/file.service");
let UserSevice = UserSevice_1 = class UserSevice {
    constructor(prisma, emailService, fileService, configService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.fileService = fileService;
        this.configService = configService;
        this.logger = new common_1.Logger(UserSevice_1.name);
    }
    async list() {
        return await this.prisma.user.findMany();
    }
    async get(id) {
        return await this.prisma.user.findUnique({ where: { id } });
    }
    async create(dto) {
        let hash;
        if (!dto.password) {
            const randomPassword = crypto.randomUUID();
            hash = await argon.hash(randomPassword);
            await this.emailService.sendInviteEmail(dto.email, randomPassword);
        }
        else {
            hash = await argon.hash(dto.password);
        }
        try {
            return await this.prisma.user.create({
                data: {
                    ...dto,
                    password: hash,
                },
            });
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
    async update(id, user) {
        try {
            const hash = user.password && (await argon.hash(user.password));
            return await this.prisma.user.update({
                where: { id },
                data: { ...user, password: hash },
            });
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
    async delete(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { shares: true },
        });
        if (!user)
            throw new common_1.BadRequestException("User not found");
        if (user.isAdmin) {
            const userCount = await this.prisma.user.count({
                where: { isAdmin: true },
            });
            if (userCount === 1) {
                throw new common_1.BadRequestException("Cannot delete the last admin user");
            }
        }
        await Promise.all(user.shares.map((share) => this.fileService.deleteAllFiles(share.id)));
        return await this.prisma.user.delete({ where: { id } });
    }
    async findOrCreateFromLDAP(providedCredentials, ldapEntry) {
        const fieldNameMemberOf = this.configService.get("ldap.fieldNameMemberOf");
        const fieldNameEmail = this.configService.get("ldap.fieldNameEmail");
        let isAdmin = false;
        if (fieldNameMemberOf in ldapEntry) {
            const adminGroup = this.configService.get("ldap.adminGroups");
            const entryGroups = Array.isArray(ldapEntry[fieldNameMemberOf])
                ? ldapEntry[fieldNameMemberOf]
                : [ldapEntry[fieldNameMemberOf]];
            isAdmin = entryGroups.includes(adminGroup) ?? false;
        }
        else {
            this.logger.warn(`Trying to create/update a ldap user but the member field ${fieldNameMemberOf} is not present.`);
        }
        let userEmail = null;
        if (fieldNameEmail in ldapEntry) {
            const value = Array.isArray(ldapEntry[fieldNameEmail])
                ? ldapEntry[fieldNameEmail][0]
                : ldapEntry[fieldNameEmail];
            if (value) {
                userEmail = value.toString();
            }
        }
        else {
            this.logger.warn(`Trying to create/update a ldap user but the email field ${fieldNameEmail} is not present.`);
        }
        if (providedCredentials.email) {
            userEmail = providedCredentials.email;
        }
        const randomId = crypto.randomUUID();
        const placeholderUsername = `ldap_user_${randomId}`;
        const placeholderEMail = `${randomId}@ldap.local`;
        try {
            const user = await this.prisma.user.upsert({
                create: {
                    username: providedCredentials.username ?? placeholderUsername,
                    email: userEmail ?? placeholderEMail,
                    password: await argon.hash(crypto.randomUUID()),
                    isAdmin,
                    ldapDN: ldapEntry.dn,
                },
                update: {
                    isAdmin,
                    ldapDN: ldapEntry.dn,
                },
                where: {
                    ldapDN: ldapEntry.dn,
                },
            });
            if (user.username === placeholderUsername) {
                await this.prisma.user
                    .update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        username: `user_${user.id}`,
                    },
                })
                    .then((newUser) => {
                    user.username = newUser.username;
                })
                    .catch((error) => {
                    this.logger.warn(`Failed to update users ${user.id} placeholder username: ${(0, util_1.inspect)(error)}`);
                });
            }
            if (userEmail && userEmail !== user.email) {
                await this.prisma.user
                    .update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        email: userEmail,
                    },
                })
                    .then((newUser) => {
                    this.logger.log(`Updated users ${user.id} email from ldap from ${user.email} to ${userEmail}.`);
                    user.email = newUser.email;
                })
                    .catch((error) => {
                    this.logger.error(`Failed to update users ${user.id} email to ${userEmail}: ${(0, util_1.inspect)(error)}`);
                });
            }
            return user;
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
};
exports.UserSevice = UserSevice;
exports.UserSevice = UserSevice = UserSevice_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        file_service_1.FileService,
        config_service_1.ConfigService])
], UserSevice);
//# sourceMappingURL=user.service.js.map