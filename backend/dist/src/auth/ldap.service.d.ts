import { ConfigService } from "../config/config.service";
import { Entry } from "ldapts";
export declare class LdapService {
    private readonly serviceConfig;
    private readonly logger;
    constructor(serviceConfig: ConfigService);
    private createLdapConnection;
    authenticateUser(username: string, password: string): Promise<Entry | null>;
}
