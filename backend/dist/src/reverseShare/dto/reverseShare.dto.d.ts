export declare class ReverseShareDTO {
    id: string;
    maxShareSize: string;
    shareExpiration: Date;
    token: string;
    simplified: boolean;
    from(partial: Partial<ReverseShareDTO>): ReverseShareDTO;
}
