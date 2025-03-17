"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOwnUserDTO = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const user_dto_1 = require("./user.dto");
class UpdateOwnUserDTO extends (0, swagger_1.PartialType)((0, swagger_1.PickType)(user_dto_1.UserDTO, ["username", "email"])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateOwnUserDTO = UpdateOwnUserDTO;
//# sourceMappingURL=updateOwnUser.dto.js.map