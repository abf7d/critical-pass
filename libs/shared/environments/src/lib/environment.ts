export const environment = {
    clientDeugLevel: 1, // 1 is debug
    serverDebugLevel: 7, // 7 is off
    serverLoggerApi: 'https://localhost:44393/api/logger',
    production: false,
    mappingApi: 'https://localhost:44342/api/', // 'http://localhost:60739/api/', //
    projectBuilderApi: 'https://localhost:44393/api/',
    authority: 'https://criticalplayground.b2clogin.com/criticalplayground.onmicrosoft.com/B2C_1_DefaultSignInSignUp',
    knownAuthorities: ['criticalplayground.b2clogin.com'],
    redirectUri: 'https://localhost:4200/welcome',
    cacheLocation: 'sessionStorage',
    loginScopes: ['openid', 'offline_access'],
    exposedApiScope: 'https://criticalplayground.onmicrosoft.com/api/read',
    postLogoutUrl: 'https://localhost:4200/home/',
    clientID: '7515b8bc-44ba-4f60-9740-62b9ac197bf3',
    payPalClientId: 'AUyE2UNCsa6sgAKS3Ccj4WUzXw-PisRoJL2zn9pzxbN5sje0xalPOx9ioUCug9sK6HQF9Vybu2Bh_4LB',

    criticalPathApi: 'https://localhost:7071/api/', // new webapi: 'https://localhost:44369/api/',  // old'https://localhost:44392/api/',// new backend:
    webApi: 'https://localhost:44369/api/', //old'https://localhost:44392/api',

    jiraClientId: '1SdMM8pTryWCljI1Awm9drfKvnU2BR2H',
    jiraClientSecret: '123',
};
