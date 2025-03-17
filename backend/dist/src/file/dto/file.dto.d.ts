import { ShareDTO } from "src/share/dto/share.dto";
export declare class FileDTO {
    id: string;
    name: string;
    size: string;
    share: ShareDTO;
    from(partial: Partial<FileDTO>): FileDTO;
}
