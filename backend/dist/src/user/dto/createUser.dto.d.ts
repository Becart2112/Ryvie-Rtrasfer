import { UserDTO } from "./user.dto";
export declare class CreateUserDTO extends UserDTO {
    isAdmin: boolean;
    password: string;
    from(partial: Partial<CreateUserDTO>): CreateUserDTO;
}
