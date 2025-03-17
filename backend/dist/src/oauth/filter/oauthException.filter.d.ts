import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
export declare class OAuthExceptionFilter implements ExceptionFilter {
    private config;
    private errorKeys;
    private readonly logger;
    constructor(config: ConfigService);
    catch(exception: HttpException, host: ArgumentsHost): void;
}
