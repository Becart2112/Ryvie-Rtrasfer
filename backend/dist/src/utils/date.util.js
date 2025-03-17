"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRelativeDateToAbsolute = parseRelativeDateToAbsolute;
exports.stringToTimespan = stringToTimespan;
exports.timespanToString = timespanToString;
const moment = require("moment");
function parseRelativeDateToAbsolute(relativeDate) {
    if (relativeDate == "never")
        return moment(0).toDate();
    return moment()
        .add(relativeDate.split("-")[0], relativeDate.split("-")[1])
        .toDate();
}
function stringToTimespan(value) {
    const [time, unit] = value.split(" ");
    return {
        value: parseInt(time),
        unit: unit,
    };
}
function timespanToString(timespan) {
    return `${timespan.value} ${timespan.unit}`;
}
//# sourceMappingURL=date.util.js.map