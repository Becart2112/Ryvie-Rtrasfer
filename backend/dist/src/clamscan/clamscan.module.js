"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClamScanModule = void 0;
const common_1 = require("@nestjs/common");
const file_module_1 = require("../file/file.module");
const clamscan_service_1 = require("./clamscan.service");
let ClamScanModule = class ClamScanModule {
};
exports.ClamScanModule = ClamScanModule;
exports.ClamScanModule = ClamScanModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => file_module_1.FileModule)],
        providers: [clamscan_service_1.ClamScanService],
        exports: [clamscan_service_1.ClamScanService],
    })
], ClamScanModule);
//# sourceMappingURL=clamscan.module.js.map