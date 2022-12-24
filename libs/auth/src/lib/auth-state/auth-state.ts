import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthStoreService {
    public isLoggedIn$: BehaviorSubject<boolean>;
    public loginError$: BehaviorSubject<boolean>;
    public isAuthorized$: BehaviorSubject<boolean>;

    constructor() {
        this.isLoggedIn$ = new BehaviorSubject<boolean>(null);
        this.loginError$ = new BehaviorSubject<boolean>(null);
        this.isAuthorized$ = new BehaviorSubject<boolean>(null);
    }
}
