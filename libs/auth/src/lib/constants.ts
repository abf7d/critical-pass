export const CLAIMS_TOKEN_CACHE_KEY: string = 'cp-claims';
export const AUTHORIZED_USER_CLAIM = 'Authorized User';
export const SITE_ADMIN_CLAIM = 'Site Admin';
export const ERROR_LOADING_CACHE = 'error-loading';
export const JIRA_LOGIN_URL =
    'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=1SdMM8pTryWCljI1Awm9drfKvnU2BR2H&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider&redirect_uri=https%3A%2F%2Flocalhost%3A4200%2Flibrary%2F(grid%2F0%2F%2Fsidebar%3Alibar%2F0)&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent';
// 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=1SdMM8pTryWCljI1Awm9drfKvnU2BR2H&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider&redirect_uri=https%3A%2F%2Flocalhost%3A4200%2F&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent'
// 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=1SdMM8pTryWCljI1Awm9drfKvnU2BR2H&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider&redirect_uri=https%3A%2F%2Flocalhost:4200%2F&response_type=code&prompt=consent';
