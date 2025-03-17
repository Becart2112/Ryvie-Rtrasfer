"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const app_module_1 = require("./app.module");
const config_service_1 = require("./config/config.service");
const constants_1 = require("./constants");
function generateNestJsLogLevels() {
    if (constants_1.LOG_LEVEL_ENV) {
        const levelIndex = constants_1.LOG_LEVEL_AVAILABLE.indexOf(constants_1.LOG_LEVEL_ENV);
        if (levelIndex === -1) {
            throw new Error(`log level ${constants_1.LOG_LEVEL_ENV} unknown`);
        }
        return constants_1.LOG_LEVEL_AVAILABLE.slice(levelIndex, constants_1.LOG_LEVEL_AVAILABLE.length);
    }
    else {
        const levelIndex = constants_1.LOG_LEVEL_AVAILABLE.indexOf(constants_1.LOG_LEVEL_DEFAULT);
        return constants_1.LOG_LEVEL_AVAILABLE.slice(levelIndex, constants_1.LOG_LEVEL_AVAILABLE.length);
    }
}
async function bootstrap() {
    const logLevels = generateNestJsLogLevels();
    common_1.Logger.log(`Showing ${logLevels.join(", ")} messages`);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: logLevels,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    const config = app.get(config_service_1.ConfigService);
    app.use((req, res, next) => {
        const chunkSize = config.get("share.chunkSize");
        bodyParser.raw({
            type: "application/octet-stream",
            limit: `${chunkSize}B`,
        })(req, res, next);
    });
    app.use(cookieParser());
    app.set("trust proxy", true);
    await fs.promises.mkdir(`${constants_1.DATA_DIRECTORY}/uploads/_temp`, {
        recursive: true,
    });
    app.setGlobalPrefix("api");
    if (process.env.NODE_ENV == "development") {
        const config = new swagger_1.DocumentBuilder()
            .setTitle("Pingvin Share API")
            .setVersion("1.0")
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup("api/swagger", app, document);
    }
    await app.listen(parseInt(process.env.BACKEND_PORT || process.env.PORT || "8080"));
    const logger = new common_1.Logger("UnhandledAsyncError");
    process.on("unhandledRejection", (e) => logger.error(e));
}
bootstrap();
//# sourceMappingURL=main.js.map