import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@critical-pass/shared/environments';
import { ClaimsApiService } from '@critical-pass/shared/data-access';
import * as CONST from '../constants';
declare let require: any;
const urljoin = require('url-join');
@Injectable({
    providedIn: 'root',
})
export class ClaimsService {
    jwtHelper: JwtHelperService;

    constructor(private claimsApi: ClaimsApiService) {
        this.jwtHelper = new JwtHelperService();
    }

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
                sessionStorage.setItem(CONST.CLAIMS_TOKEN_CACHE_KEY, tokenString);
                const isAuthorized = this.isAuthorized();
                return isAuthorized;
            });
    }

    public clearClaims(): void {
        sessionStorage.removeItem(CONST.CLAIMS_TOKEN_CACHE_KEY);
    }

    public hasClaims(): boolean {
        return !!sessionStorage.getItem(CONST.CLAIMS_TOKEN_CACHE_KEY);
    }

    private decodeClaims(): string[] {
        const token = sessionStorage.getItem(CONST.CLAIMS_TOKEN_CACHE_KEY);
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
        return claims.indexOf(CONST.AUTHORIZED_USER_CLAIM) > -1 || claims.indexOf(CONST.SITE_ADMIN_CLAIM) > -1;
    }
    public isAdmin(): boolean {
        const claims = this.decodeClaims();
        return claims.indexOf(CONST.SITE_ADMIN_CLAIM) > -1;
    }
    public setError(create: boolean): void {
        if (create) {
            sessionStorage.setItem(CONST.ERROR_LOADING_CACHE, 'true');
        }
    }
    public clearError(): void {
        sessionStorage.removeItem(CONST.ERROR_LOADING_CACHE);
    }

    public hasError(): boolean {
        return !!sessionStorage.getItem(CONST.ERROR_LOADING_CACHE);
    }
}
