"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_LEVEL_ENV = exports.LOG_LEVEL_DEFAULT = exports.LOG_LEVEL_AVAILABLE = exports.CLAMAV_PORT = exports.CLAMAV_HOST = exports.DATABASE_URL = exports.SHARE_DIRECTORY = exports.DATA_DIRECTORY = void 0;
exports.DATA_DIRECTORY = process.env.DATA_DIRECTORY || "./data";
exports.SHARE_DIRECTORY = `${exports.DATA_DIRECTORY}/uploads/shares`;
exports.DATABASE_URL = process.env.DATABASE_URL ||
    "file:../data/pingvin-share.db?connection_limit=1";
exports.CLAMAV_HOST = process.env.CLAMAV_HOST ||
    (process.env.NODE_ENV == "docker" ? "clamav" : "127.0.0.1");
exports.CLAMAV_PORT = parseInt(process.env.CLAMAV_PORT) || 3310;
exports.LOG_LEVEL_AVAILABLE = ['verbose', 'debug', 'log', 'warn', 'error', 'fatal'];
exports.LOG_LEVEL_DEFAULT = process.env.NODE_ENV === 'development' ? "verbose" : "log";
exports.LOG_LEVEL_ENV = `${process.env.PV_LOG_LEVEL || ""}`;
//# sourceMappingURL=constants.js.map