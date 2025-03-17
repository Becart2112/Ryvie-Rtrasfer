import { ConfigService } from "../../config/config.service";
import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";
import { OAuthProvider, OAuthToken } from "./oauthProvider.interface";
export declare class DiscordProvider implements OAuthProvider<DiscordToken> {
    private config;
    constructor(config: ConfigService);
    getAuthEndpoint(state: string): Promise<string>;
    private getAuthorizationHeader;
    getToken(query: OAuthCallbackDto): Promise<OAuthToken<DiscordToken>>;
    getUserInfo(token: OAuthToken<DiscordToken>): Promise<OAuthSignInDto>;
    checkLimitedGuild(token: OAuthToken<DiscordToken>, guildId: string): Promise<void>;
    checkLimitedUsers(user: DiscordUser, userIds: string): Promise<void>;
}
export interface DiscordToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}
export interface DiscordUser {
    id: string;
    username: string;
    global_name: string;
    email: string;
    verified: boolean;
}
export interface DiscordPartialGuild {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[];
}
