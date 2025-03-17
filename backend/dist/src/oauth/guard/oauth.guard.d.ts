import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class OAuthGuard implements CanActivate {
    constructor();
    canActivate(context: ExecutionContext): boolean;
}
