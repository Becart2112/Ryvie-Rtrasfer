import { FileDTO } from "src/file/dto/file.dto";
import { PublicUserDTO } from "src/user/dto/publicUser.dto";
export declare class ShareDTO {
    id: string;
    name?: string;
    expiration: Date;
    files: FileDTO[];
    creator: PublicUserDTO;
    description: string;
    hasPassword: boolean;
    size: number;
    from(partial: Partial<ShareDTO>): ShareDTO;
    fromList(partial: Partial<ShareDTO>[]): ShareDTO[];
}
