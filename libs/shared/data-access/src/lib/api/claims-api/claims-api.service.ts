import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import urlJoin from 'url-join';
import { environment } from '@critical-pass/shared/environments';
@Injectable({
    providedIn: 'root',
})
export class ClaimsApiService {
    constructor(private http: HttpClient) {}

    public getClaims(): Observable<any> {
        return this.http.get(urlJoin(environment.criticalPathApi, '/account/getToken?token_type=claims'));
    }
}
