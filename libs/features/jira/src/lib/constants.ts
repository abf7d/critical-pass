export const JIRA_LOGIN_URL =
    'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=1SdMM8pTryWCljI1Awm9drfKvnU2BR2H&scope=read%3Ame&redirect_uri=https%3A%2F%2Flocalhost%3A4200%2Fjira&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent';
// 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=1SdMM8pTryWCljI1Awm9drfKvnU2BR2H&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider&redirect_uri=https%3A%2F%2Flocalhost%3A4200%2F&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent'
// 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=1SdMM8pTryWCljI1Awm9drfKvnU2BR2H&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider&redirect_uri=https%3A%2F%2Flocalhost:4200%2F&response_type=code&prompt=consent';
export const JIRA_TOKEN_URL = 'https://auth.atlassian.com/oauth/token';
export const JIRA_REDIRECT_URI = 'https://localhost:4200/jira';
export const JIRA_CLOUD_ID_URL = 'https://api.atlassian.com/oauth/token/accessible-resources';
export const JIRA_ISSUES_URL = 'https://criticalpass.atlassian.net/rest/api/3/search?jql=project%20%3D%20CP';
// https://api.atlassian.com/oauth/token/accessible-resources