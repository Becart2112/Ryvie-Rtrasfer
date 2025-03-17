import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { ErrorPageException } from "../exceptions/errorPage.exception";
export declare class ErrorPageExceptionFilter implements ExceptionFilter {
    private config;
    private readonly logger;
    constructor(config: ConfigService);
    catch(exception: ErrorPageException, host: ArgumentsHost): void;
}
