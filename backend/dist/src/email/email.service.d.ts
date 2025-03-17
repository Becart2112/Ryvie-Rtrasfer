import { User } from "@prisma/client";
import * as nodemailer from "nodemailer";
import { ConfigService } from "src/config/config.service";
export declare class EmailService {
    private config;
    constructor(config: ConfigService);
    private readonly logger;
    getTransporter(): nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
    private sendMail;
    sendMailToShareRecipients(recipientEmail: string, shareId: string, creator?: User, description?: string, expiration?: Date): Promise<void>;
    sendMailToReverseShareCreator(recipientEmail: string, shareId: string): Promise<void>;
    sendResetPasswordEmail(recipientEmail: string, token: string): Promise<void>;
    sendInviteEmail(recipientEmail: string, password: string): Promise<void>;
    sendTestMail(recipientEmail: string): Promise<void>;
}
