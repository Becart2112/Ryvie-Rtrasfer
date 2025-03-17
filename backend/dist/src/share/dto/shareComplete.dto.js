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
exports.CompletedShareDTO = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const share_dto_1 = require("./share.dto");
class CompletedShareDTO extends share_dto_1.ShareDTO {
    from(partial) {
        return (0, class_transformer_1.plainToClass)(CompletedShareDTO, partial, {
            excludeExtraneousValues: true,
        });
    }
    fromList(partial) {
        return partial.map((part) => (0, class_transformer_1.plainToClass)(CompletedShareDTO, part, { excludeExtraneousValues: true }));
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { notifyReverseShareCreator: { required: false, type: () => Boolean } };
    }
}
exports.CompletedShareDTO = CompletedShareDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], CompletedShareDTO.prototype, "notifyReverseShareCreator", void 0);
//# sourceMappingURL=shareComplete.dto.js.map