"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const reverseShare_module_1 = require("../reverseShare/reverseShare.module");
const share_module_1 = require("../share/share.module");
const file_controller_1 = require("./file.controller");
const file_service_1 = require("./file.service");
const local_service_1 = require("./local.service");
const s3_service_1 = require("./s3.service");
let FileModule = class FileModule {
};
exports.FileModule = FileModule;
exports.FileModule = FileModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({}), reverseShare_module_1.ReverseShareModule, share_module_1.ShareModule],
        controllers: [file_controller_1.FileController],
        providers: [file_service_1.FileService, local_service_1.LocalFileService, s3_service_1.S3FileService],
        exports: [file_service_1.FileService],
    })
], FileModule);
//# sourceMappingURL=file.module.js.map