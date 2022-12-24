import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountDataService } from '../../services/account-data-sevice';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthorizedUserGuard implements CanLoad {
    jwtHelper: JwtHelperService;
    constructor(private authService: AuthService, private accountData: AccountDataService, private router: Router) {
        this.jwtHelper = new JwtHelperService();
    }

    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService
            .getAuthToken()
            .then(token => {
                const isLoggedIn = !this.authService.accessExpired();
                if (!isLoggedIn) {
                    // claims needs to include user id in name so the someone else's claims can't be reused
                    this.accountData.clearClaims();
                    this.router.navigate(['/home']);
                    return false;
                }
                // Check if token has expired, if so, return false
                return this.accountData.isAdmin() || this.accountData.isAuthorized();
            })
            .catch(error => {
                this.router.navigate(['/home']);
                return false;
            });
    }
}
