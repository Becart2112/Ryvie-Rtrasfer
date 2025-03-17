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
exports.ReverseShareTokenWithShares = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const myShare_dto_1 = require("../../share/dto/myShare.dto");
const reverseShare_dto_1 = require("./reverseShare.dto");
class ReverseShareTokenWithShares extends (0, swagger_1.OmitType)(reverseShare_dto_1.ReverseShareDTO, [
    "shareExpiration",
]) {
    fromList(partial) {
        return partial.map((part) => (0, class_transformer_1.plainToClass)(ReverseShareTokenWithShares, part, {
            excludeExtraneousValues: true,
        }));
    }
}
exports.ReverseShareTokenWithShares = ReverseShareTokenWithShares;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ReverseShareTokenWithShares.prototype, "shareExpiration", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => (0, swagger_1.OmitType)(myShare_dto_1.MyShareDTO, ["recipients", "hasPassword"])),
    __metadata("design:type", Array)
], ReverseShareTokenWithShares.prototype, "shares", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ReverseShareTokenWithShares.prototype, "remainingUses", void 0);
//# sourceMappingURL=reverseShareTokenWithShares.js.map