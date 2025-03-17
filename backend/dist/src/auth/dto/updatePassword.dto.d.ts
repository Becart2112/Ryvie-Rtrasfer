import { UserDTO } from "src/user/dto/user.dto";
declare const UpdatePasswordDTO_base: import("@nestjs/common").Type<Pick<UserDTO, "password">>;
export declare class UpdatePasswordDTO extends UpdatePasswordDTO_base {
    oldPassword?: string;
}
export {};
