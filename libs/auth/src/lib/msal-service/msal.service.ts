import { Inject, Injectable } from '@angular/core';
import { AuthStoreService } from '../auth-state/auth-state';
import { AccountDataService } from '../account-data/account-data-sevice';
import { BehaviorSubject } from 'rxjs';
import * as Keys from '../../constants/keys';
import * as Msal from '@azure/msal-browser';
import { MsalConfigFactoryService } from '../msal-config-factory/msal-config-factory.service';
import { PdConfig } from '../../models/pd-app.config';

@Injectable({
    providedIn: 'root',
})
export class /*AuthService*/ MsalService {
    private loginRequest: Msal.RedirectRequest;
    private accessTokenRequest: Msal.SilentRequest;
    private logoutRequest: Msal.EndSessionRequest;
    public isLoggedIn$: BehaviorSubject<boolean>;
    private msalInstance: Msal.PublicClientApplication;

    constructor(
        private accountDataService: AccountDataService,
        private authStore: AuthStoreService,
        configFactory: MsalConfigFactoryService,
        @Inject(Keys.APP_CONFIG) config: PdConfig,
    ) {
        this.loginRequest = {
            scopes: config.loginScopes,
            extraScopesToConsent: [config.exposedApiScope],
        };
        this.accessTokenRequest = {
            scopes: [config.exposedApiScope],
            account: null,
        };
        this.logoutRequest = {
            postLogoutRedirectUri: config.postLogoutUrl,
        };
        this.isLoggedIn$ = authStore.isLoggedIn$;
        const msalConfig = configFactory.get();
        this.msalInstance = new Msal.PublicClientApplication(msalConfig);
        this.msalInstance
            .handleRedirectPromise()
            .then((tokenResponse: Msal.AuthenticationResult) => {
                if (tokenResponse !== null) {
                    const accountObj = tokenResponse.account;
                    this.accessTokenRequest.account = accountObj;
                    this.acquireSilent(this.accessTokenRequest);
                }
            })
            .catch(error => {
                authStore.loginError$.next(true);
                console.error(error);
                accountDataService.setError(true);
            });
    }

    private acquireSilent(request: Msal.SilentRequest): Promise<Msal.AuthenticationResult> {
        return this.msalInstance.acquireTokenSilent(request).then(
            access_token => {
                if (!access_token.accessToken) {
                    this.msalInstance.acquireTokenRedirect(request);
                    this.authStore.loginError$.next(true);
                    this.accountDataService.setError(true);
                } else {
                    sessionStorage.removeItem(Keys.claimsTokenCacheKey);
                    this.accountDataService.initializeClaims().then(
                        isAuthorized => {
                            this.authStore.isAuthorized$.next(isAuthorized);
                        },
                        reason => {
                            console.error(reason);
                            this.authStore.loginError$.next(true);
                        },
                    );
                    this.isLoggedIn$.next(true);
                }
                return access_token;
            },
            function (reason) {
                console.error(reason);
                this.authStore.loginError$.next(true);
                this.accountDataService.setError(true);
                return null;
            },
        );
    }

    public login(): void {
        this.msalInstance.loginRedirect(this.loginRequest);
    }

    public accessExpired(): boolean {
        return !this.msalInstance.getAllAccounts()[0];
    }

    public getAuthToken(): Promise<Msal.AuthenticationResult> {
        const accounts = this.msalInstance.getAllAccounts();
        this.accessTokenRequest.account = accounts[0];
        return this.msalInstance.acquireTokenSilent(this.accessTokenRequest);
    }

    public logout(): void {
        this.authStore.loginError$.next(false);
        this.accountDataService.clearError();
        this.accountDataService.clearClaims();
        this.msalInstance.logout(this.logoutRequest);
    }

    public loadUserGroups(): Promise<any> {
        return this.accountDataService.initializeClaims();
    }

    public getUserName(): string {
        const account = this.msalInstance.getAllAccounts()[0];
        if (account) {
            return account.name;
        }
        return '';
    }

    public hasClaims(): boolean {
        return this.accountDataService.hasClaims();
    }

    public isAuthorized(): boolean {
        return this.accountDataService.isAuthorized();
    }

    public hasError(): boolean {
        return this.accountDataService.hasError();
    }
}
