export declare function parseRelativeDateToAbsolute(relativeDate: string): Date;
type Timespan = {
    value: number;
    unit: "minutes" | "hours" | "days" | "weeks" | "months" | "years";
};
export declare function stringToTimespan(value: string): Timespan;
export declare function timespanToString(timespan: Timespan): string;
export {};
