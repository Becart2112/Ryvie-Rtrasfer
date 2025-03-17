"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicUserDTO = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const user_dto_1 = require("./user.dto");
class PublicUserDTO extends (0, swagger_1.PickType)(user_dto_1.UserDTO, ["username"]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PublicUserDTO = PublicUserDTO;
//# sourceMappingURL=publicUser.dto.js.map