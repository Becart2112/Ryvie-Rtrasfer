import { UserDTO } from "src/user/dto/user.dto";
declare const ResetPasswordDTO_base: import("@nestjs/common").Type<Pick<UserDTO, "password">>;
export declare class ResetPasswordDTO extends ResetPasswordDTO_base {
    token: string;
}
export {};
