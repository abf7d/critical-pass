export const environment = {
    production: true,
    clientDeugLevel: 7, // 1 is debug
    serverDebugLevel: 7, // 7 is off
    serverLoggerApi: 'https://<place-holder>',
    mappingApi: 'https://criticalpathapi.azurewebsites.net/api/', // for msproj files and building arrow diagram
    authority: 'https://criticalplayground.b2clogin.com/criticalplayground.onmicrosoft.com/B2C_1_DefaultSignInSignUp',
    knownAuthorities: ['criticalplayground.b2clogin.com'],
    redirectUri: 'https://criticalpass.azurewebsites.net/welcome',
    cacheLocation: 'sessionStorage',
    loginScopes: ['openid', 'offline_access'],
    exposedApiScope:'https://criticalplayground.onmicrosoft.com/api/read',
    postLogoutUrl: 'https://criticalpass.azurewebsites.net/home/',
    clientID: '7515b8bc-44ba-4f60-9740-62b9ac197bf3', 
    payPalClientId: 'AUyE2UNCsa6sgAKS3Ccj4WUzXw-PisRoJL2zn9pzxbN5sje0xalPOx9ioUCug9sK6HQF9Vybu2Bh_4LB',
    criticalPathApi: 'https://criticalpathapifunctions.azurewebsites.net/api/' 

};
