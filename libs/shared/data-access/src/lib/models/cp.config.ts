export interface CpConfig {
    clientDeugLevel: number;
    serverDebugLevel: number;
    serverLoggerApi: string;
    production: boolean;
    mappingApi: string;
    projectBuilderApi: string;
    authority: string;
    knownAuthorities: string[];
    redirectUri: string;
    cacheLocation: string;
    loginScopes: string[];
    exposedApiScope: string;
    postLogoutUrl: string;
    clientID: string; 
    payPalClientId: string;
    criticalPathApi:string;
    webApi: string;
};