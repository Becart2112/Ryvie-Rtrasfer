"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const contentDisposition = require("content-disposition");
const createShare_guard_1 = require("../share/guard/createShare.guard");
const shareOwner_guard_1 = require("../share/guard/shareOwner.guard");
const file_service_1 = require("./file.service");
const fileSecurity_guard_1 = require("./guard/fileSecurity.guard");
const mime = require("mime-types");
let FileController = class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async create(query, body, shareId) {
        const { id, name, chunkIndex, totalChunks } = query;
        return await this.fileService.create(body, { index: parseInt(chunkIndex), total: parseInt(totalChunks) }, { id, name }, shareId);
    }
    async getZip(res, shareId) {
        const zipStream = this.fileService.getZip(shareId);
        res.set({
            "Content-Type": "application/zip",
            "Content-Disposition": contentDisposition(`${shareId}.zip`),
        });
        return new common_1.StreamableFile(zipStream);
    }
    async getFile(res, shareId, fileId, download = "true") {
        const file = await this.fileService.get(shareId, fileId);
        const headers = {
            "Content-Type": mime?.lookup?.(file.metaData.name) || "application/octet-stream",
            "Content-Length": file.metaData.size,
            "Content-Security-Policy": "script-src 'none'",
        };
        if (download === "true") {
            headers["Content-Disposition"] = contentDisposition(file.metaData.name);
        }
        else {
            headers["Content-Disposition"] = contentDisposition(file.metaData.name, {
                type: "inline",
            });
        }
        res.set(headers);
        return new common_1.StreamableFile(file.file);
    }
    async remove(fileId, shareId) {
        await this.fileService.remove(shareId, fileId);
    }
};
exports.FileController = FileController;
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.UseGuards)(createShare_guard_1.CreateShareGuard, shareOwner_guard_1.ShareOwnerGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)("shareId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("zip"),
    (0, common_1.UseGuards)(fileSecurity_guard_1.FileSecurityGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Param)("shareId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getZip", null);
__decorate([
    (0, common_1.Get)(":fileId"),
    (0, common_1.UseGuards)(fileSecurity_guard_1.FileSecurityGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Param)("shareId")),
    __param(2, (0, common_1.Param)("fileId")),
    __param(3, (0, common_1.Query)("download")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getFile", null);
__decorate([
    (0, common_1.Delete)(":fileId"),
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.UseGuards)(shareOwner_guard_1.ShareOwnerGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("fileId")),
    __param(1, (0, common_1.Param)("shareId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "remove", null);
exports.FileController = FileController = __decorate([
    (0, common_1.Controller)("shares/:shareId/files"),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileController);
//# sourceMappingURL=file.controller.js.map