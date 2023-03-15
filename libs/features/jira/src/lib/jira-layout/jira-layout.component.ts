import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@critical-pass/shared/environments';
import * as CONST from '../constants';
import { CORE_CONST } from '@critical-pass/core';
import { Activity, Project } from '@critical-pass/project/types';
import { JiraImportMapperService, JiraProjectResult } from '@critical-pass/shared/file-management';
import { NodeConnectorService } from '@critical-pass/project/processor';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import urlJoin from 'url-join';
@Component({
    selector: 'critical-pass-jira-layout',
    templateUrl: './jira-layout.component.html',
    styleUrls: ['./jira-layout.component.scss'],
})
export class JiraLayoutComponent implements OnInit {
    private cloudId: string | null = null;
    public project: Project | null = null;
    public baseUrl = environment.criticalPathApi;
    constructor(
        private httpClient: HttpClient,
        private route: ActivatedRoute,
        private connector: NodeConnectorService,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private importer: JiraImportMapperService,
    ) {}
    public ngOnInit(): void {
        const code = this.route.snapshot.queryParams['code'];
        console.log('code', this.route.snapshot.queryParams['code']);
        if (code) {
            this.getJiraToken(code);
        }
    }
    public getJiraToken(code: string): void {
        this.httpClient.get<{ access_token: string }>(urlJoin(this.baseUrl, 'account/jira-token', code)).subscribe(
            res => {
                console.log('token', res);
                localStorage.setItem(CORE_CONST.JIRA_TOKEN_KEY, res.access_token);
                this.getIssues();
            },
            err => {
                console.error(err);
            },
        );
        return;
        // this.httpClient
        //     .post(CONST.JIRA_TOKEN_URL, {
        //         grant_type: 'authorization_code',
        //         code,
        //         client_id: environment.jiraClientId,
        //         client_secret: environment.jiraClientSecret,
        //         redirect_uri: CONST.JIRA_REDIRECT_URI,
        //     })
        //     .subscribe((res: any) => {
        //         console.log('res', res);
        //         localStorage.setItem(CORE_CONST.JIRA_TOKEN_KEY, res.access_token);
        //         this.getIssues();
        //     });
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
            this.httpClient.get<JiraProjectResult>(`${CONST.JIRA_ISSUES_URL}${this.cloudId}/${CONST.JIRA_API}`, requestOptions).subscribe((res: any) => {
                this.getActivities(res);
            });
        }
    }
    // Convert JiraProjectResult to Activity[]
    private getActivities(response: JiraProjectResult): void {
        //TODO: create arrowsnapshot, extract lasso from network bar to shared/components then add here  connect to zametek endpoint, position chart, save graph info to jira
        const project = this.importer.mapJiraProject(response);
        if (project) {
            this.connector.connectArrowsToNodes(project);
            this.dashboard.activeProject$.next(project);
        }
        this.project = project;
        // console.log('project', p);
    }
    public getProjects() {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            this.httpClient
                .get<JiraProjectResult>(`${CONST.JIRA_ISSUES_URL}${this.cloudId}/${CONST.JIRA_PROJECTS_URL}`, requestOptions)
                .subscribe((res: any) => {
                    const projects: JiraProject[] = res.values.map((p: any) => {
                        return { id: p.id, key: p.key, name: p.name };
                    });
                    console.log('projects', projects);
                });
        }
    }

    public toJira(): void {
        window.location.href = CONST.JIRA_LOGIN_URL;
    }
}

// 1) get a lisst of projects and create a list on the page to select a project
// 1.1)  we need to create a custom propery in jira for the project to test saving nodes
// 2) get a list of issues for the selected project
// 3) create a graph from the issues
// 4) save the graph to jira BUT first we need to create a custom propery in jira for the project
// URL to set Project properties:
// PUT /rest/api/3/project/{projectIdOrKey}/properties/{propertyKey}
export interface JiraProject {
    id: string;
    key: string;
    name: string;
}

/*
const bodyData = `{
  "number": 5,
  "string": "string-value"
}`;

fetch('https://your-domain.atlassian.net/rest/api/3/project/{projectIdOrKey}/properties/{propertyKey}', {
  method: 'PUT',
  headers: {
    'Authorization': `Basic ${Buffer.from(
      'email@example.com:<api_token>'
    ).toString('base64')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: bodyData
})
  .then(response => {
    console.log(
      `Response: ${response.status} ${response.statusText}`
    );
    return response.text();
  })
  .then(text => console.log(text))
  .catch(err => console.error(err));*/
