import { ConfigDTO } from "./config.dto";
export declare class AdminConfigDTO extends ConfigDTO {
    name: string;
    secret: boolean;
    defaultValue: string;
    updatedAt: Date;
    obscured: boolean;
    allowEdit: boolean;
    from(partial: Partial<AdminConfigDTO>): AdminConfigDTO;
    fromList(partial: Partial<AdminConfigDTO>[]): AdminConfigDTO[];
}
