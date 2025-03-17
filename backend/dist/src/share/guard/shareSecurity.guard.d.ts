import { ExecutionContext } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ShareService } from "src/share/share.service";
import { ConfigService } from "src/config/config.service";
import { JwtGuard } from "src/auth/guard/jwt.guard";
export declare class ShareSecurityGuard extends JwtGuard {
    private shareService;
    private prisma;
    constructor(shareService: ShareService, prisma: PrismaService, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
