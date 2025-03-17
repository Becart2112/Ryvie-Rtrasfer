import { EmailService } from "src/email/email.service";
import { ConfigService } from "./config.service";
import { AdminConfigDTO } from "./dto/adminConfig.dto";
import { ConfigDTO } from "./dto/config.dto";
import { TestEmailDTO } from "./dto/testEmail.dto";
import UpdateConfigDTO from "./dto/updateConfig.dto";
import { LogoService } from "./logo.service";
export declare class ConfigController {
    private configService;
    private logoService;
    private emailService;
    constructor(configService: ConfigService, logoService: LogoService, emailService: EmailService);
    list(): Promise<ConfigDTO[]>;
    getByCategory(category: string): Promise<AdminConfigDTO[]>;
    updateMany(data: UpdateConfigDTO[]): Promise<AdminConfigDTO[]>;
    testEmail({ email }: TestEmailDTO): Promise<void>;
    uploadLogo(file: Express.Multer.File): Promise<void>;
}
