import { GenericOidcProvider, OidcToken } from "./genericOidc.provider";
import { ConfigService } from "../../config/config.service";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";
import { OAuthToken } from "./oauthProvider.interface";
export declare class OidcProvider extends GenericOidcProvider {
    protected cache: Cache;
    constructor(config: ConfigService, jwtService: JwtService, cache: Cache);
    protected getDiscoveryUri(): string;
    getUserInfo(token: OAuthToken<OidcToken>, query: OAuthCallbackDto, _?: string): Promise<OAuthSignInDto>;
}
