export declare class TokenDTO {
    accessToken: string;
    refreshToken: string;
    from(partial: Partial<TokenDTO>): TokenDTO;
}
