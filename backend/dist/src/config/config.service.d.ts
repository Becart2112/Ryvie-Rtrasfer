import { Logger } from "@nestjs/common";
import { Config } from "@prisma/client";
import { EventEmitter } from "events";
import { PrismaService } from "src/prisma/prisma.service";
import { YamlConfig } from "../../prisma/seed/config.seed";
export declare class ConfigService extends EventEmitter {
    private configVariables;
    private prisma;
    yamlConfig?: YamlConfig;
    logger: Logger;
    constructor(configVariables: Config[], prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private loadYamlConfig;
    private migrateInitUser;
    get(key: `${string}.${string}`): any;
    getByCategory(category: string): Promise<{
        key: string;
        value: string;
        allowEdit: boolean;
        name: string;
        category: string;
        order: number;
        updatedAt: Date;
        type: string;
        defaultValue: string;
        obscured: boolean;
        secret: boolean;
        locked: boolean;
    }[]>;
    list(): Promise<{
        key: string;
        value: string;
        name: string;
        category: string;
        order: number;
        updatedAt: Date;
        type: string;
        defaultValue: string;
        obscured: boolean;
        secret: boolean;
        locked: boolean;
    }[]>;
    updateMany(data: {
        key: string;
        value: string | number | boolean;
    }[]): Promise<{
        name: string;
        category: string;
        order: number;
        updatedAt: Date;
        type: string;
        defaultValue: string;
        value: string | null;
        obscured: boolean;
        secret: boolean;
        locked: boolean;
    }[]>;
    update(key: string, value: string | number | boolean): Promise<{
        name: string;
        category: string;
        order: number;
        updatedAt: Date;
        type: string;
        defaultValue: string;
        value: string | null;
        obscured: boolean;
        secret: boolean;
        locked: boolean;
    }>;
    validateConfigVariable(key: string, value: string | number | boolean): void;
    isEditAllowed(): boolean;
}
