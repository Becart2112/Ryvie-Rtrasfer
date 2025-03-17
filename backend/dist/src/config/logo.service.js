"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const sharp = require("sharp");
const IMAGES_PATH = "../frontend/public/img";
let LogoService = class LogoService {
    async create(file) {
        const resized = await sharp(file).resize(900).toBuffer();
        fs.writeFileSync(`${IMAGES_PATH}/logo.png`, resized, "binary");
        this.createFavicon(file);
        this.createPWAIcons(file);
    }
    async createFavicon(file) {
        const resized = await sharp(file).resize(16).toBuffer();
        fs.promises.writeFile(`${IMAGES_PATH}/favicon.ico`, resized, "binary");
    }
    async createPWAIcons(file) {
        const sizes = [48, 72, 96, 128, 144, 152, 192, 384, 512];
        for (const size of sizes) {
            const resized = await sharp(file).resize(size).toBuffer();
            fs.promises.writeFile(`${IMAGES_PATH}/icons/icon-${size}x${size}.png`, resized, "binary");
        }
    }
};
exports.LogoService = LogoService;
exports.LogoService = LogoService = __decorate([
    (0, common_1.Injectable)()
], LogoService);
//# sourceMappingURL=logo.service.js.map