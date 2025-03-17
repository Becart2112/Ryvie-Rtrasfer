export declare class UserDTO {
    id: string;
    username: string;
    email: string;
    hasPassword: boolean;
    password: string;
    isAdmin: boolean;
    isLdap: boolean;
    ldapDN?: string;
    totpVerified: boolean;
    from(partial: Partial<UserDTO>): UserDTO;
    fromList(partial: Partial<UserDTO>[]): UserDTO[];
}
