import { UserDTO } from "./user.dto";
declare const PublicUserDTO_base: import("@nestjs/common").Type<Pick<UserDTO, "username">>;
export declare class PublicUserDTO extends PublicUserDTO_base {
}
export {};
