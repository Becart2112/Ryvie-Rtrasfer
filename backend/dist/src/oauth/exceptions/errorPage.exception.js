"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorPageException = void 0;
class ErrorPageException extends Error {
    constructor(key = "default", redirect, params) {
        super("error");
        this.key = key;
        this.redirect = redirect;
        this.params = params;
    }
}
exports.ErrorPageException = ErrorPageException;
//# sourceMappingURL=errorPage.exception.js.map