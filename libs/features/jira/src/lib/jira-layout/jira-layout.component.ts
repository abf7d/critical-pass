import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@critical-pass/shared/environments';
import * as CONST from '../constants';
import { CORE_CONST } from '@critical-pass/core';
@Component({
    selector: 'critical-pass-jira-layout',
    templateUrl: './jira-layout.component.html',
    styleUrls: ['./jira-layout.component.scss'],
})
export class JiraLayoutComponent implements OnInit {
    private cloudId: string | null = null;
    constructor(private httpClient: HttpClient, private route: ActivatedRoute) {}
    public ngOnInit(): void {
        const code = this.route.snapshot.queryParams['code'];
        console.log('code', this.route.snapshot.queryParams['code']);
        if (code) {
            this.getJiraToken(code);
        }
    }
    public getJiraToken(code: string): void {
        this.httpClient
            .post(CONST.JIRA_TOKEN_URL, {
                grant_type: 'authorization_code',
                code,
                client_id: environment.jiraClientId,
                client_secret: environment.jiraClientSecret,
                redirect_uri: CONST.JIRA_REDIRECT_URI,
            })
            .subscribe((res: any) => {
                console.log('res', res);
                localStorage.setItem(CORE_CONST.JIRA_TOKEN_KEY, res.access_token);
                this.getIssues();
            });
    }
    public getIssues(): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            this.httpClient.get(CONST.JIRA_CLOUD_ID_URL, requestOptions).subscribe((res: any) => {
                console.log('issues res', res);
                this.cloudId = res[0].id;
                this.getJiraProject();
                
            });
        }
    }
    public getJiraProject(): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            this.httpClient.get(`${CONST.JIRA_ISSUES_URL}${this.cloudId}/${CONST.JIRA_API}`, requestOptions).subscribe((res: any) => {
                console.log('issues res', res);
            });
        }
    }
    public toJira(): void {
        window.location.href = CONST.JIRA_LOGIN_URL;
    }
}
