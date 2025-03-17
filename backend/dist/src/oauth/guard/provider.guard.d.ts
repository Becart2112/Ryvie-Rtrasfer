import { CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
export declare class ProviderGuard implements CanActivate {
    private config;
    private platforms;
    constructor(config: ConfigService, platforms: string[]);
    canActivate(context: ExecutionContext): boolean;
}
