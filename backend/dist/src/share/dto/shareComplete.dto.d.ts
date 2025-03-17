import { ShareDTO } from "./share.dto";
export declare class CompletedShareDTO extends ShareDTO {
    notifyReverseShareCreator?: boolean;
    from(partial: Partial<CompletedShareDTO>): CompletedShareDTO;
    fromList(partial: Partial<CompletedShareDTO>[]): CompletedShareDTO[];
}
