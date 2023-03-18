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
    public selectedProject: JiraProject | null = null;
    public projects: JiraProject[] = [];
    public selectedTab: string | null = null;
    constructor(
        private httpClient: HttpClient,
        private route: ActivatedRoute,
        private connector: NodeConnectorService,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private importer: JiraImportMapperService,
    ) {}
    public ngOnInit(): void {
        const code = this.route.snapshot.queryParams['code'];
        if (code) {
            this.getJiraToken(code);
        }
    }
    public getJiraToken(code: string): void {
        this.httpClient.get<{ access_token: string }>(urlJoin(this.baseUrl, 'account/jira-token', code)).subscribe(
            res => {
                localStorage.setItem(CORE_CONST.JIRA_TOKEN_KEY, res.access_token);
                this.getCloudId();
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
    public getCloudId(): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            this.httpClient.get(CONST.JIRA_CLOUD_ID_URL, requestOptions).subscribe((res: any) => {
                this.cloudId = res[0].id;
                this.getProjects();
            });
        }
    }

    public getJiraProject(project: JiraProject): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            // const projectUrl = `${CONST.JIRA_QUERY_BASE_URL}${this.cloudId}/${CONST.JIRA_PROJECT_QUERY}${project.key}`;
            // const projectUrl = `${CONST.JIRA_QUERY_BASE_URL}${this.cloudId}/${CONST.JIRA_PROJECT_QUERY}${project.key}`;// urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_PROJECT_QUERY, project.key);
            const projectUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, `${CONST.JIRA_PROJECT_QUERY}${project.key}`);
            // console.log(projectUrl)
            // console.log('url2', url2);

            this.httpClient.get<JiraProjectResult>(projectUrl, requestOptions).subscribe((res: any) => {
                this.getActivities(res);
            });
        }
    }
    private getActivities(response: JiraProjectResult): void {
        const project = this.importer.mapJiraProject(response);
        if (project) {
            this.connector.connectArrowsToNodes(project);
            this.dashboard.activeProject$.next(project);
        }
        this.project = project;
    }
    public getProjects() {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            // const projectsUrl = `${CONST.JIRA_QUERY_BASE_URL}${this.cloudId}/${CONST.JIRA_PROJECTS_ENDPOINT}`;
            const projectsUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_PROJECTS_ENDPOINT);

            this.httpClient.get<JiraProjectResult>(projectsUrl, requestOptions).subscribe((res: any) => {
                this.projects = res.values.map((p: any) => {
                    return { id: p.id, key: p.key, name: p.name };
                });
                this.selectedTab = 'projects';
            });
        }
    }

    public setProjectProperty(project: JiraProject): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            const propertyKey = 'my-project-property';
            const bodyData = {
                number: 5,
                string: 'string-value',
            };
            const body = JSON.stringify(bodyData);

            // const propertyUrl = `${CONST.JIRA_QUERY_BASE_URL}${this.cloudId}/${CONST.JIRA_PROJECT_PROPERTY_URL}${project.key}/${CONST.JIRA_PROJECT_PROPERTY_ENDPOINT}/${propertyKey}`;
            const propertyUrl = urlJoin(
                CONST.JIRA_QUERY_BASE_URL,
                this.cloudId!,
                CONST.JIRA_PROJECT_PROPERTY_URL,
                project.key,
                CONST.JIRA_PROJECT_PROPERTY_ENDPOINT,
                propertyKey,
            );
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            this.httpClient.put(propertyUrl, body, requestOptions).subscribe((res: any) => {
                console.log(res);
            });
        }
    }
    public getProjectProperty(project: JiraProject): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            const propertyKey = 'my-project-property';
            // const propertyUrl = `${CONST.JIRA_QUERY_BASE_URL}${this.cloudId}/${CONST.JIRA_PROJECT_PROPERTY_URL}${project.key}/${CONST.JIRA_PROJECT_PROPERTY_ENDPOINT}/${propertyKey}`;
            const propertyUrl = urlJoin(
                CONST.JIRA_QUERY_BASE_URL,
                this.cloudId!,
                CONST.JIRA_PROJECT_PROPERTY_URL,
                project.key,
                CONST.JIRA_PROJECT_PROPERTY_ENDPOINT,
                propertyKey,
            );
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            this.httpClient.get(propertyUrl, requestOptions).subscribe((res: any) => {
                console.log(res);
            });
        }
    }

    public toJira(): void {
        window.location.href = CONST.JIRA_LOGIN_URL;
    }
    public selectProject(project: JiraProject): void {
        this.selectedProject = project;
        this.getJiraProject(project);
        this.selectedTab = 'viz';
    }
}

// 1) get a lisst of projects and create a list on the page to select a project
// 1.1)  we need to create a custom propery in jira for the project to test saving nodes
// 1.2) add story points to issues in jira, then convert to days for activity duration
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
