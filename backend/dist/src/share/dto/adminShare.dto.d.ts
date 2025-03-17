import { ShareDTO } from "./share.dto";
declare const AdminShareDTO_base: import("@nestjs/common").Type<Omit<ShareDTO, "from" | "fromList" | "files">>;
export declare class AdminShareDTO extends AdminShareDTO_base {
    views: number;
    createdAt: Date;
    from(partial: Partial<AdminShareDTO>): AdminShareDTO;
    fromList(partial: Partial<AdminShareDTO>[]): AdminShareDTO[];
}
export {};
