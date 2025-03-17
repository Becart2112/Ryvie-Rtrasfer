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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
const nodemailer = require("nodemailer");
const config_service_1 = require("../config/config.service");
let EmailService = EmailService_1 = class EmailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    getTransporter() {
        if (!this.config.get("smtp.enabled"))
            throw new common_1.InternalServerErrorException("SMTP is disabled");
        const username = this.config.get("smtp.username");
        const password = this.config.get("smtp.password");
        return nodemailer.createTransport({
            host: this.config.get("smtp.host"),
            port: this.config.get("smtp.port"),
            secure: this.config.get("smtp.port") == 465,
            auth: username || password ? { user: username, pass: password } : undefined,
            tls: {
                rejectUnauthorized: !this.config.get("smtp.allowUnauthorizedCertificates"),
            },
        });
    }
    async sendMail(email, subject, text) {
        await this.getTransporter()
            .sendMail({
            from: `"${this.config.get("general.appName")}" <${this.config.get("smtp.email")}>`,
            to: email,
            subject,
            text,
        })
            .catch((e) => {
            this.logger.error(e);
            throw new common_1.InternalServerErrorException("Failed to send email");
        });
    }
    async sendMailToShareRecipients(recipientEmail, shareId, creator, description, expiration) {
        if (!this.config.get("email.enableShareEmailRecipients"))
            throw new common_1.InternalServerErrorException("Email service disabled");
        const shareUrl = `${this.config.get("general.appUrl")}/s/${shareId}`;
        await this.sendMail(recipientEmail, this.config.get("email.shareRecipientsSubject"), this.config
            .get("email.shareRecipientsMessage")
            .replaceAll("\\n", "\n")
            .replaceAll("{creator}", creator?.username ?? "Someone")
            .replaceAll("{creatorEmail}", creator?.email ?? "")
            .replaceAll("{shareUrl}", shareUrl)
            .replaceAll("{desc}", description ?? "No description")
            .replaceAll("{expires}", moment(expiration).unix() != 0
            ? moment(expiration).fromNow()
            : "in: never"));
    }
    async sendMailToReverseShareCreator(recipientEmail, shareId) {
        const shareUrl = `${this.config.get("general.appUrl")}/s/${shareId}`;
        await this.sendMail(recipientEmail, this.config.get("email.reverseShareSubject"), this.config
            .get("email.reverseShareMessage")
            .replaceAll("\\n", "\n")
            .replaceAll("{shareUrl}", shareUrl));
    }
    async sendResetPasswordEmail(recipientEmail, token) {
        const resetPasswordUrl = `${this.config.get("general.appUrl")}/auth/resetPassword/${token}`;
        await this.sendMail(recipientEmail, this.config.get("email.resetPasswordSubject"), this.config
            .get("email.resetPasswordMessage")
            .replaceAll("\\n", "\n")
            .replaceAll("{url}", resetPasswordUrl));
    }
    async sendInviteEmail(recipientEmail, password) {
        const loginUrl = `${this.config.get("general.appUrl")}/auth/signIn`;
        await this.sendMail(recipientEmail, this.config.get("email.inviteSubject"), this.config
            .get("email.inviteMessage")
            .replaceAll("{url}", loginUrl)
            .replaceAll("{password}", password)
            .replaceAll("{email}", recipientEmail));
    }
    async sendTestMail(recipientEmail) {
        await this.getTransporter()
            .sendMail({
            from: `"${this.config.get("general.appName")}" <${this.config.get("smtp.email")}>`,
            to: recipientEmail,
            subject: "Test email",
            text: "This is a test email",
        })
            .catch((e) => {
            this.logger.error(e);
            throw new common_1.InternalServerErrorException(e.message);
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map