import { ExecutionContext } from "@nestjs/common";
import { ConfigService } from "src/config/config.service";
declare const JwtGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtGuard extends JwtGuard_base {
    private config;
    constructor(config: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
