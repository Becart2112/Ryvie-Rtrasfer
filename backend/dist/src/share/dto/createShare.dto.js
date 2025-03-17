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
exports.CreateShareDTO = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shareSecurity_dto_1 = require("./shareSecurity.dto");
class CreateShareDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String, minLength: 3, maxLength: 50, pattern: "^[a-zA-Z0-9_-]*$" }, name: { required: true, type: () => String, minLength: 3, maxLength: 30 }, expiration: { required: true, type: () => String }, description: { required: true, type: () => String, maxLength: 512 }, recipients: { required: true, type: () => [String] }, security: { required: true, type: () => require("./shareSecurity.dto").ShareSecurityDTO } };
    }
}
exports.CreateShareDTO = CreateShareDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)("^[a-zA-Z0-9_-]*$", undefined, {
        message: "ID can only contain letters, numbers, underscores and hyphens",
    }),
    (0, class_validator_1.Length)(3, 50),
    __metadata("design:type", String)
], CreateShareDTO.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 30),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateShareDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShareDTO.prototype, "expiration", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(512),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateShareDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], CreateShareDTO.prototype, "recipients", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => shareSecurity_dto_1.ShareSecurityDTO),
    __metadata("design:type", shareSecurity_dto_1.ShareSecurityDTO)
], CreateShareDTO.prototype, "security", void 0);
//# sourceMappingURL=createShare.dto.js.map