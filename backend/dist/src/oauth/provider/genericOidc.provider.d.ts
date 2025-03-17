import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import { ConfigService } from "../../config/config.service";
import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";
import { OAuthProvider, OAuthToken } from "./oauthProvider.interface";
export declare abstract class GenericOidcProvider implements OAuthProvider<OidcToken> {
    protected name: string;
    protected keyOfConfigUpdateEvents: string[];
    protected config: ConfigService;
    protected jwtService: JwtService;
    protected cache: Cache;
    protected discoveryUri: string;
    private configuration;
    private jwk;
    private logger;
    protected constructor(name: string, keyOfConfigUpdateEvents: string[], config: ConfigService, jwtService: JwtService, cache: Cache);
    protected getRedirectUri(): string;
    getConfiguration(): Promise<OidcConfiguration>;
    getJwk(): Promise<OidcJwk[]>;
    getAuthEndpoint(state: string): Promise<string>;
    getToken(query: OAuthCallbackDto): Promise<OAuthToken<OidcToken>>;
    getUserInfo(token: OAuthToken<OidcToken>, query: OAuthCallbackDto, claim?: string, roleConfig?: {
        path?: string;
        generalAccess?: string;
        adminAccess?: string;
    }): Promise<OAuthSignInDto>;
    protected abstract getDiscoveryUri(): string;
    private fetchConfiguration;
    private fetchJwk;
    private deinit;
    private decodeIdToken;
}
export interface OidcCache<T> {
    expires: number;
    data: T;
}
export interface OidcConfiguration {
    issuer: string;
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint?: string;
    jwks_uri: string;
    response_types_supported: string[];
    id_token_signing_alg_values_supported: string[];
    scopes_supported?: string[];
    claims_supported?: string[];
    frontchannel_logout_supported?: boolean;
    end_session_endpoint?: string;
}
export interface OidcJwk {
    e: string;
    alg: string;
    kid: string;
    use: string;
    kty: string;
    n: string;
}
export type OidcConfigurationCache = OidcCache<OidcConfiguration>;
export type OidcJwkCache = OidcCache<OidcJwk[]>;
export interface OidcToken {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    id_token: string;
}
export interface OidcIdToken {
    iss: string;
    sub: string;
    exp: number;
    iat: number;
    email: string;
    name: string;
    nickname: string;
    preferred_username: string;
    nonce: string;
}
