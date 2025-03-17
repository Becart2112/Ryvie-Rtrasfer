import { ExecutionContext } from "@nestjs/common";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { ConfigService } from "src/config/config.service";
import { ReverseShareService } from "src/reverseShare/reverseShare.service";
export declare class CreateShareGuard extends JwtGuard {
    private reverseShareService;
    constructor(configService: ConfigService, reverseShareService: ReverseShareService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
