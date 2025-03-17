import { UserDTO } from "./user.dto";
declare const UpdateOwnUserDTO_base: import("@nestjs/common").Type<Partial<Pick<UserDTO, "email" | "username">>>;
export declare class UpdateOwnUserDTO extends UpdateOwnUserDTO_base {
}
export {};
