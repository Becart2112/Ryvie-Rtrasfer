import { GenericOidcProvider } from "./genericOidc.provider";
import { ConfigService } from "../../config/config.service";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
export declare class GoogleProvider extends GenericOidcProvider {
    constructor(config: ConfigService, jwtService: JwtService, cache: Cache);
    protected getDiscoveryUri(): string;
}
