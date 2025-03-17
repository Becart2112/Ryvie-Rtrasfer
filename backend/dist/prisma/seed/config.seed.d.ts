export declare const configVariables: {
    internal: {
        jwtSecret: {
            type: string;
            value: string;
            locked: true;
        };
    };
    general: {
        appName: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        appUrl: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        secureCookies: {
            type: string;
            defaultValue: string;
        };
        showHomePage: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        sessionDuration: {
            type: string;
            defaultValue: string;
            secret: false;
        };
    };
    share: {
        allowRegistration: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        allowUnauthenticatedShares: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        maxExpiration: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        shareIdLength: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        maxSize: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        zipCompressionLevel: {
            type: string;
            defaultValue: string;
        };
        chunkSize: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        autoOpenShareModal: {
            type: string;
            defaultValue: string;
            secret: false;
        };
    };
    email: {
        enableShareEmailRecipients: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        shareRecipientsSubject: {
            type: string;
            defaultValue: string;
        };
        shareRecipientsMessage: {
            type: string;
            defaultValue: string;
        };
        reverseShareSubject: {
            type: string;
            defaultValue: string;
        };
        reverseShareMessage: {
            type: string;
            defaultValue: string;
        };
        resetPasswordSubject: {
            type: string;
            defaultValue: string;
        };
        resetPasswordMessage: {
            type: string;
            defaultValue: string;
        };
        inviteSubject: {
            type: string;
            defaultValue: string;
        };
        inviteMessage: {
            type: string;
            defaultValue: string;
        };
    };
    smtp: {
        enabled: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        allowUnauthorizedCertificates: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        host: {
            type: string;
            defaultValue: string;
        };
        port: {
            type: string;
            defaultValue: string;
        };
        email: {
            type: string;
            defaultValue: string;
        };
        username: {
            type: string;
            defaultValue: string;
        };
        password: {
            type: string;
            defaultValue: string;
            obscured: true;
        };
    };
    ldap: {
        enabled: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        url: {
            type: string;
            defaultValue: string;
        };
        bindDn: {
            type: string;
            defaultValue: string;
        };
        bindPassword: {
            type: string;
            defaultValue: string;
            obscured: true;
        };
        searchBase: {
            type: string;
            defaultValue: string;
        };
        searchQuery: {
            type: string;
            defaultValue: string;
        };
        adminGroups: {
            type: string;
            defaultValue: string;
        };
        fieldNameMemberOf: {
            type: string;
            defaultValue: string;
        };
        fieldNameEmail: {
            type: string;
            defaultValue: string;
        };
    };
    oauth: {
        allowRegistration: {
            type: string;
            defaultValue: string;
        };
        ignoreTotp: {
            type: string;
            defaultValue: string;
        };
        disablePassword: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        "github-enabled": {
            type: string;
            defaultValue: string;
        };
        "github-clientId": {
            type: string;
            defaultValue: string;
        };
        "github-clientSecret": {
            type: string;
            defaultValue: string;
            obscured: true;
        };
        "google-enabled": {
            type: string;
            defaultValue: string;
        };
        "google-clientId": {
            type: string;
            defaultValue: string;
        };
        "google-clientSecret": {
            type: string;
            defaultValue: string;
            obscured: true;
        };
        "microsoft-enabled": {
            type: string;
            defaultValue: string;
        };
        "microsoft-tenant": {
            type: string;
            defaultValue: string;
        };
        "microsoft-clientId": {
            type: string;
            defaultValue: string;
        };
        "microsoft-clientSecret": {
            type: string;
            defaultValue: string;
            obscured: true;
        };
        "discord-enabled": {
            type: string;
            defaultValue: string;
        };
        "discord-limitedGuild": {
            type: string;
            defaultValue: string;
        };
        "discord-limitedUsers": {
            type: string;
            defaultValue: string;
        };
        "discord-clientId": {
            type: string;
            defaultValue: string;
        };
        "discord-clientSecret": {
            type: string;
            defaultValue: string;
            obscured: true;
        };
        "oidc-enabled": {
            type: string;
            defaultValue: string;
        };
        "oidc-discoveryUri": {
            type: string;
            defaultValue: string;
        };
        "oidc-signOut": {
            type: string;
            defaultValue: string;
        };
        "oidc-scope": {
            type: string;
            defaultValue: string;
        };
        "oidc-usernameClaim": {
            type: string;
            defaultValue: string;
        };
        "oidc-rolePath": {
            type: string;
            defaultValue: string;
        };
        "oidc-roleGeneralAccess": {
            type: string;
            defaultValue: string;
        };
        "oidc-roleAdminAccess": {
            type: string;
            defaultValue: string;
        };
        "oidc-clientId": {
            type: string;
            defaultValue: string;
        };
        "oidc-clientSecret": {
            type: string;
            defaultValue: string;
            obscured: true;
        };
    };
    s3: {
        enabled: {
            type: string;
            defaultValue: string;
        };
        endpoint: {
            type: string;
            defaultValue: string;
        };
        region: {
            type: string;
            defaultValue: string;
        };
        bucketName: {
            type: string;
            defaultValue: string;
        };
        bucketPath: {
            type: string;
            defaultValue: string;
        };
        key: {
            type: string;
            defaultValue: string;
            secret: true;
        };
        secret: {
            type: string;
            defaultValue: string;
            obscured: true;
        };
    };
    legal: {
        enabled: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        imprintText: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        imprintUrl: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        privacyPolicyText: {
            type: string;
            defaultValue: string;
            secret: false;
        };
        privacyPolicyUrl: {
            type: string;
            defaultValue: string;
            secret: false;
        };
    };
};
export type YamlConfig = {
    [Category in keyof typeof configVariables]: {
        [Key in keyof (typeof configVariables)[Category]]: string;
    };
} & {
    initUser: {
        enabled: string;
        username: string;
        email: string;
        password: string;
        isAdmin: boolean;
        ldapDN: string;
    };
};
