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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminShareDTO = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const share_dto_1 = require("./share.dto");
class AdminShareDTO extends (0, swagger_1.OmitType)(share_dto_1.ShareDTO, [
    "files",
    "from",
    "fromList",
]) {
    from(partial) {
        return (0, class_transformer_1.plainToClass)(AdminShareDTO, partial, {
            excludeExtraneousValues: true,
        });
    }
    fromList(partial) {
        return partial.map((part) => (0, class_transformer_1.plainToClass)(AdminShareDTO, part, { excludeExtraneousValues: true }));
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { views: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date } };
    }
}
exports.AdminShareDTO = AdminShareDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AdminShareDTO.prototype, "views", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], AdminShareDTO.prototype, "createdAt", void 0);
//# sourceMappingURL=adminShare.dto.js.map