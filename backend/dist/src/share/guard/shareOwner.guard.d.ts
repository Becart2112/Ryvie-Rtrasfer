import { ExecutionContext } from "@nestjs/common";
import { ConfigService } from "src/config/config.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtGuard } from "../../auth/guard/jwt.guard";
export declare class ShareOwnerGuard extends JwtGuard {
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
