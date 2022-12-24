import { BehaviorSubject, combineLatest } from 'rxjs';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthStateService, MsalService } from '@critical-pass/auth';
import * as CONST from '../../constants';
@Component({
    selector: 'cp-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
    public loading!: boolean;
    public isLoggedIn$: BehaviorSubject<boolean | null>;
    public name!: string;
    public isLoggedIn!: boolean;
    public unauthorizedClaims!: boolean;
    public errorLoadingProject: boolean;
    public thirdPartyCookiesBlocked: boolean;

    public isAuthorized: boolean | null;
    public loginError!: boolean | null;
    public showLoading: boolean;
    public isAuthorized$: BehaviorSubject<boolean | null>;
    public loginError$: BehaviorSubject<boolean | null>;

    constructor(private authService: MsalService, private router: Router, private authStore: AuthStateService) {
        this.isLoggedIn$ = this.authStore.isLoggedIn$;
        this.errorLoadingProject = false;
        this.thirdPartyCookiesBlocked = false;

        this.showLoading = !this.authService.hasClaims() && !this.authService.hasError();
        this.isAuthorized = this.authService.isAuthorized();
        this.isAuthorized$ = this.authStore.isAuthorized$;
        this.loginError$ = this.authStore.loginError$;
    }

    public ngOnInit() {
        this.loading = false;
        this.isLoggedIn$.subscribe((loggedIn: boolean | null) => {
            this.name = this.authService.getUserName() ?? '';
            this.isLoggedIn = !this.authService.accessExpired();
        });
        this.loginError$.pipe(filter(x => x !== null)).subscribe(error => {
            this.showLoading = false;
            this.loginError = error;
        });
        this.isAuthorized$.pipe(filter(auth => auth !== null)).subscribe(isAuthorized => {
            this.isAuthorized = isAuthorized;
            this.showLoading = false;
        });
    }

    public login() {
        this.authService.login();
    }

    public logout() {
        this.authService.logout();
    }

    public loadLibrary() {
        if (this.isAuthorized) {
            this.loading = true;
            this.errorLoadingProject = false;
            this.router.navigateByUrl(CONST.LIBRARY_ROUTE);
        }
    }

    @HostListener('window:message', ['$event'])
    public receiveMessage(event: any) {
        if (event.data === CONST.COOKIES_BLOCKED_ID) {
            this.thirdPartyCookiesBlocked = true;
        } else if (event.data === CONST.COOKIES_AVAIL_ID) {
            this.thirdPartyCookiesBlocked = false;
        }
    }
}
