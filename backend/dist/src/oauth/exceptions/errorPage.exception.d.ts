export declare class ErrorPageException extends Error {
    readonly key: string;
    readonly redirect?: string;
    readonly params?: string[];
    constructor(key?: string, redirect?: string, params?: string[]);
}
