import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
    jwtHelper: JwtHelperService;
    constructor(private authenticationService: AuthService) {
        this.jwtHelper = new JwtHelperService();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const _this = this;
        return from(this.authenticationService.getAuthToken()).pipe(
            switchMap(token => {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token.accessToken}`,
                    },
                });
                return next.handle(req);
            }),
        );
    }
}
