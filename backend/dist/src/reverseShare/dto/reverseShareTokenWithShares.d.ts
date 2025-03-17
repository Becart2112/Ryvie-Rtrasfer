import { MyShareDTO } from "src/share/dto/myShare.dto";
import { ReverseShareDTO } from "./reverseShare.dto";
declare const ReverseShareTokenWithShares_base: import("@nestjs/common").Type<Omit<ReverseShareDTO, "shareExpiration">>;
export declare class ReverseShareTokenWithShares extends ReverseShareTokenWithShares_base {
    shareExpiration: Date;
    shares: Omit<MyShareDTO, "recipients" | "files" | "from" | "fromList" | "hasPassword" | "size">[];
    remainingUses: number;
    fromList(partial: Partial<ReverseShareTokenWithShares>[]): ReverseShareTokenWithShares[];
}
export {};
