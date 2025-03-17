import { UserDTO } from "src/user/dto/user.dto";
declare const VerifyTotpDTO_base: import("@nestjs/common").Type<Pick<UserDTO, "password">>;
export declare class VerifyTotpDTO extends VerifyTotpDTO_base {
    code: string;
}
export {};
