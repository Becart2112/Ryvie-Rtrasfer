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
exports.ConfigDTO = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class ConfigDTO {
    fromList(partial) {
        return partial.map((part) => (0, class_transformer_1.plainToClass)(ConfigDTO, part, { excludeExtraneousValues: true }));
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { key: { required: true, type: () => String }, value: { required: true, type: () => String }, type: { required: true, type: () => String } };
    }
}
exports.ConfigDTO = ConfigDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ConfigDTO.prototype, "key", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ConfigDTO.prototype, "value", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ConfigDTO.prototype, "type", void 0);
//# sourceMappingURL=config.dto.js.map