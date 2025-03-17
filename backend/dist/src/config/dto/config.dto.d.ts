export declare class ConfigDTO {
    key: string;
    value: string;
    type: string;
    fromList(partial: Partial<ConfigDTO>[]): ConfigDTO[];
}
