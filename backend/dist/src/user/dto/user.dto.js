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
exports.UserDTO = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UserDTO {
    from(partial) {
        const result = (0, class_transformer_1.plainToClass)(UserDTO, partial, {
            excludeExtraneousValues: true,
        });
        result.isLdap = partial.ldapDN?.length > 0;
        return result;
    }
    fromList(partial) {
        return partial.map((part) => this.from(part));
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, username: { required: true, type: () => String, minLength: 3, maxLength: 32, pattern: "^[a-zA-Z0-9_.]*$" }, email: { required: true, type: () => String }, hasPassword: { required: true, type: () => Boolean }, password: { required: true, type: () => String, minLength: 8 }, isAdmin: { required: true, type: () => Boolean }, isLdap: { required: true, type: () => Boolean }, ldapDN: { required: false, type: () => String }, totpVerified: { required: true, type: () => Boolean } };
    }
}
exports.UserDTO = UserDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserDTO.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Matches)("^[a-zA-Z0-9_.]*$", undefined, {
        message: "Username can only contain letters, numbers, dots and underscores",
    }),
    (0, class_validator_1.Length)(3, 32),
    __metadata("design:type", String)
], UserDTO.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserDTO.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserDTO.prototype, "hasPassword", void 0);
__decorate([
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], UserDTO.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserDTO.prototype, "isAdmin", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserDTO.prototype, "isLdap", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserDTO.prototype, "totpVerified", void 0);
//# sourceMappingURL=user.dto.js.map