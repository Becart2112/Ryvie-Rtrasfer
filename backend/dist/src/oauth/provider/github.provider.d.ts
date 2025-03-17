import { ConfigService } from "../../config/config.service";
import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";
import { OAuthProvider, OAuthToken } from "./oauthProvider.interface";
export declare class GitHubProvider implements OAuthProvider<GitHubToken> {
    private config;
    constructor(config: ConfigService);
    getAuthEndpoint(state: string): Promise<string>;
    getToken(query: OAuthCallbackDto): Promise<OAuthToken<GitHubToken>>;
    getUserInfo(token: OAuthToken<GitHubToken>): Promise<OAuthSignInDto>;
    private getGitHubUser;
    private getGitHubEmail;
}
export interface GitHubToken {
    access_token: string;
    token_type: string;
    scope: string;
}
export interface GitHubUser {
    login: string;
    id: number;
    name?: string;
    email?: string;
}
export interface GitHubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
}
