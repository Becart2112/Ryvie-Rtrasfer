import { ShareSecurityDTO } from "./shareSecurity.dto";
export declare class CreateShareDTO {
    id: string;
    name: string;
    expiration: string;
    description: string;
    recipients: string[];
    security: ShareSecurityDTO;
}
