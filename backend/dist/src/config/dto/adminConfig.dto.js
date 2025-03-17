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
exports.AdminConfigDTO = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const config_dto_1 = require("./config.dto");
class AdminConfigDTO extends config_dto_1.ConfigDTO {
    from(partial) {
        return (0, class_transformer_1.plainToClass)(AdminConfigDTO, partial, {
            excludeExtraneousValues: true,
        });
    }
    fromList(partial) {
        return partial.map((part) => (0, class_transformer_1.plainToClass)(AdminConfigDTO, part, { excludeExtraneousValues: true }));
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, secret: { required: true, type: () => Boolean }, defaultValue: { required: true, type: () => String }, updatedAt: { required: true, type: () => Date }, obscured: { required: true, type: () => Boolean }, allowEdit: { required: true, type: () => Boolean } };
    }
}
exports.AdminConfigDTO = AdminConfigDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdminConfigDTO.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], AdminConfigDTO.prototype, "secret", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdminConfigDTO.prototype, "defaultValue", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], AdminConfigDTO.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], AdminConfigDTO.prototype, "obscured", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], AdminConfigDTO.prototype, "allowEdit", void 0);
//# sourceMappingURL=adminConfig.dto.js.map