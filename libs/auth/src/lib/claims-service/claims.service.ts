import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as Keys from '../constants/keys';
import { PdConfig } from '../models/pd-app.config';
import { ClaimsApiService } from '@critical-pass/shared/data-access';

declare let require: any;
const urljoin = require('url-join');
@Injectable({
    providedIn: 'root',
})
export class /*AccountDataService*/ ClaimsService {
    jwtHelper: JwtHelperService;

    constructor(/*private http: HttpClient,*/ private claimsApi: ClaimsApiService, @Inject(Keys.APP_CONFIG) private config: PdConfig) {
        this.jwtHelper = new JwtHelperService();
    }

    // public getClaims(): Observable<any> {
    //     return this.http.get(urljoin(this.config.criticalPathApi, '/account/getToken?token_type=claims'));
    // }

    public initializeClaims(): Promise<any> {
        return this.claimsApi
            .getClaims()
            .toPromise()
            .then(token => {
                const auth_token = this.jwtHelper.decodeToken(token.Result.Token);
                const expDate = this.jwtHelper.getTokenExpirationDate(token.Result.Token);
                const tokenString = JSON.stringify({
                    username: auth_token.sub,
                    token: { auth_token: token.Result.Token },
                });
                sessionStorage.setItem(Keys.claimsTokenCacheKey, tokenString);
                const isAuthorized = this.isAuthorized();
                return isAuthorized;
            });
    }

    public clearClaims(): void {
        sessionStorage.removeItem(Keys.claimsTokenCacheKey);
    }

    public hasClaims(): boolean {
        return !!sessionStorage.getItem(Keys.claimsTokenCacheKey);
    }

    private decodeClaims(): string[] {
        const token = sessionStorage.getItem(Keys.claimsTokenCacheKey);
        if (token === null) {
            return [];
        }

        const tokenJson = JSON.parse(token);
        if (tokenJson?.token?.auth_token) {
            const info = this.jwtHelper.decodeToken(tokenJson.token.auth_token);
            if (info === null || info.group === undefined) {
                return [];
            }
            return info.group;
        }
        return [];
    }

    public isAuthorized(): boolean {
        const claims = this.decodeClaims();
        return claims.indexOf(Keys.AuthorizedUserClaim) > -1 || claims.indexOf(Keys.SiteAdminClaim) > -1;
    }
    public isAdmin(): boolean {
        const claims = this.decodeClaims();
        return claims.indexOf(Keys.SiteAdminClaim) > -1;
    }
    public setError(create: boolean): void {
        if (create) {
            sessionStorage.setItem(Keys.ErrorLoadingCache, 'true');
        }
    }
    public clearError(): void {
        sessionStorage.removeItem(Keys.ErrorLoadingCache);
    }

    public hasError(): boolean {
        return !!sessionStorage.getItem(Keys.ErrorLoadingCache);
    }
}
