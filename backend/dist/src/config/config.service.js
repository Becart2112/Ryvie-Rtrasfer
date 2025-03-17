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
var ConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const argon = require("argon2");
const events_1 = require("events");
const fs = require("fs");
const prisma_service_1 = require("../prisma/prisma.service");
const date_util_1 = require("../utils/date.util");
const yaml_1 = require("yaml");
let ConfigService = ConfigService_1 = class ConfigService extends events_1.EventEmitter {
    constructor(configVariables, prisma) {
        super();
        this.configVariables = configVariables;
        this.prisma = prisma;
        this.logger = new common_1.Logger(ConfigService_1.name);
    }
    async onModuleInit() {
        await this.loadYamlConfig();
        if (this.yamlConfig) {
            await this.migrateInitUser();
        }
    }
    async loadYamlConfig() {
        let configFile = "";
        try {
            configFile = fs.readFileSync("../config.yaml", "utf8");
        }
        catch (e) {
            this.logger.log("Config.yaml is not set. Falling back to UI configuration.");
        }
        try {
            this.yamlConfig = (0, yaml_1.parse)(configFile);
            if (this.yamlConfig) {
                for (const configVariable of this.configVariables) {
                    const category = this.yamlConfig[configVariable.category];
                    if (!category)
                        continue;
                    configVariable.value = category[configVariable.name];
                }
            }
        }
        catch (e) {
            this.logger.error("Failed to parse config.yaml. Falling back to UI configuration: ", e);
        }
    }
    async migrateInitUser() {
        if (!this.yamlConfig.initUser.enabled)
            return;
        const userCount = await this.prisma.user.count({
            where: { isAdmin: true },
        });
        if (userCount === 1) {
            this.logger.log("Skip initial user creation. Admin user is already existent.");
            return;
        }
        await this.prisma.user.create({
            data: {
                email: this.yamlConfig.initUser.email,
                username: this.yamlConfig.initUser.username,
                password: this.yamlConfig.initUser.password
                    ? await argon.hash(this.yamlConfig.initUser.password)
                    : null,
                isAdmin: this.yamlConfig.initUser.isAdmin,
            },
        });
    }
    get(key) {
        const configVariable = this.configVariables.filter((variable) => `${variable.category}.${variable.name}` == key)[0];
        if (!configVariable)
            throw new Error(`Config variable ${key} not found`);
        const value = configVariable.value ?? configVariable.defaultValue;
        if (configVariable.type == "number" || configVariable.type == "filesize")
            return parseInt(value);
        if (configVariable.type == "boolean")
            return value == "true";
        if (configVariable.type == "string" || configVariable.type == "text")
            return value;
        if (configVariable.type == "timespan")
            return (0, date_util_1.stringToTimespan)(value);
    }
    async getByCategory(category) {
        const configVariables = this.configVariables
            .filter((c) => !c.locked && category == c.category)
            .sort((c) => c.order);
        return configVariables.map((variable) => {
            return {
                ...variable,
                key: `${variable.category}.${variable.name}`,
                value: variable.value ?? variable.defaultValue,
                allowEdit: this.isEditAllowed(),
            };
        });
    }
    async list() {
        const configVariables = this.configVariables.filter((c) => !c.secret);
        return configVariables.map((variable) => {
            return {
                ...variable,
                key: `${variable.category}.${variable.name}`,
                value: variable.value ?? variable.defaultValue,
            };
        });
    }
    async updateMany(data) {
        if (!this.isEditAllowed())
            throw new common_1.BadRequestException("You are only allowed to update config variables via the config.yaml file");
        const response = [];
        for (const variable of data) {
            response.push(await this.update(variable.key, variable.value));
        }
        return response;
    }
    async update(key, value) {
        if (!this.isEditAllowed())
            throw new common_1.BadRequestException("You are only allowed to update config variables via the config.yaml file");
        const configVariable = await this.prisma.config.findUnique({
            where: {
                name_category: {
                    category: key.split(".")[0],
                    name: key.split(".")[1],
                },
            },
        });
        if (!configVariable || configVariable.locked)
            throw new common_1.NotFoundException("Config variable not found");
        if (value === "") {
            value = null;
        }
        else if (typeof value != configVariable.type &&
            typeof value == "string" &&
            configVariable.type != "text" &&
            configVariable.type != "timespan") {
            throw new common_1.BadRequestException(`Config variable must be of type ${configVariable.type}`);
        }
        this.validateConfigVariable(key, value);
        const updatedVariable = await this.prisma.config.update({
            where: {
                name_category: {
                    category: key.split(".")[0],
                    name: key.split(".")[1],
                },
            },
            data: { value: value === null ? null : value.toString() },
        });
        this.configVariables = await this.prisma.config.findMany();
        this.emit("update", key, value);
        return updatedVariable;
    }
    validateConfigVariable(key, value) {
        const validations = [
            {
                key: "share.shareIdLength",
                condition: (value) => value >= 2 && value <= 50,
                message: "Share ID length must be between 2 and 50",
            },
            {
                key: "share.zipCompressionLevel",
                condition: (value) => value >= 0 && value <= 9,
                message: "Zip compression level must be between 0 and 9",
            },
        ];
        const validation = validations.find((validation) => validation.key == key);
        if (validation && !validation.condition(value)) {
            throw new common_1.BadRequestException(validation.message);
        }
    }
    isEditAllowed() {
        return this.yamlConfig === undefined || this.yamlConfig === null;
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = ConfigService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("CONFIG_VARIABLES")),
    __metadata("design:paramtypes", [Array, prisma_service_1.PrismaService])
], ConfigService);
//# sourceMappingURL=config.service.js.map