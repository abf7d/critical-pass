import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@critical-pass/shared/environments';
import * as CONST from '../constants';
import { CORE_CONST } from '@critical-pass/core';
import { Activity, Project } from '@critical-pass/project/types';
import { JiraImportMapperService, JiraProjectResult } from '@critical-pass/shared/file-management';
import { NodeConnectorService } from '@critical-pass/project/processor';
import { API_CONST, DashboardService, DASHBOARD_TOKEN, ProjectStorageApiService } from '@critical-pass/shared/data-access';
import urlJoin from 'url-join';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { ProjectSanatizerService } from '@critical-pass/shared/project-utils';
import { forkJoin, Subscription } from 'rxjs';
@Component({
    selector: 'critical-pass-jira-layout',
    templateUrl: './jira-layout.component.html',
    styleUrls: ['./jira-layout.component.scss'],
})
export class JiraLayoutComponent implements OnInit, OnDestroy {
    private cloudId: string | null = null;
    public project: Project | null = null;
    public baseUrl = environment.criticalPathApi;
    public selectedProject: JiraProject | null = null;
    public projects: JiraProject[] = [];
    public selectedTab: string | null = null;
    public projectKey: string | null = null;
    public sub!: Subscription;
    constructor(
        private httpClient: HttpClient,
        private route: ActivatedRoute,
        private connector: NodeConnectorService,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private importer: JiraImportMapperService,
        private sanitizer: ProjectSanatizerService,
        private serializer: ProjectSerializerService,
    ) {}
    public ngOnInit(): void {
        const code = this.route.snapshot.queryParams['code'];
        if (code) {
            this.getJiraToken(code);
        }
        this.sub = this.dashboard.activeProject$.subscribe(project => {
            this.project = project;
        });
    }
    public ngOnDestroy(): void {
        this.sub.unsubscribe();
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
            const projectUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, `${CONST.JIRA_PROJECT_QUERY}${project.key}`);
            this.httpClient.get<JiraProjectResult>(projectUrl, requestOptions).subscribe((res: any) => {
                this.convertIssuesToProject(res);
            });
        }
    }
    private convertIssuesToProject(response: JiraProjectResult): void {
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
            const projectsUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_PROJECTS_ENDPOINT);

            this.httpClient.get<JiraProjectResult>(projectsUrl, requestOptions).subscribe((res: any) => {
                this.projects = res.values.map((p: any) => {
                    return { id: p.id, key: p.key, name: p.name };
                });
                this.selectedTab = 'projects';
            });
        }
    }

    public setProjectProperty(): void {
        const project = this.selectedProject;
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            const propertyKey = CONST.CP_PROPERTY_KEY;
            const copy = this.serializer.fromJson(this.project) as any;
            
            this.sanitizer.sanatizeForSave(copy);
            copy.profile.subProject = undefined;
            copy.profile.view = undefined;
            
            const projectTxt = JSON.stringify(copy);
            const bodyData = {
                string: projectTxt,
            };
            // const smallerBody = '{"string": ' + projectTxt + '}';
            
            // This adds a lot of escape characters, need to use gzip to compress the json
            // compress bodyData string
            // const compressed = pako.gzip(JSON.stringify(bodyData), { to: 'string' });
            const body = JSON.stringify(bodyData);
            // const body = JSON.stringify(smallerBody);
            
            const propertyUrl = urlJoin(
                CONST.JIRA_QUERY_BASE_URL,
                this.cloudId!,
                CONST.JIRA_PROJECT_PROPERTY_URL,
                project!.key,
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
    public getProjectProperty(): void {
        const project = this.selectedProject;
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            const propertyKey = CONST.CP_PROPERTY_KEY;
            const propertyUrl = urlJoin(
                CONST.JIRA_QUERY_BASE_URL,
                this.cloudId!,
                CONST.JIRA_PROJECT_PROPERTY_URL,
                project!.key,
                CONST.JIRA_PROJECT_PROPERTY_ENDPOINT,
                propertyKey,
            );
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            this.httpClient.get(propertyUrl, requestOptions).subscribe((res: any) => {
                const projectTxt = res.value.string;
                const json = JSON.parse(projectTxt);
                const projectObj = this.serializer.fromJson(json);
                this.connector.connectArrowsToNodes(projectObj);
                projectObj.profile.view.autoZoom = true;
                this.dashboard.activeProject$.next(projectObj);
            });
        }
    }

    public toJira(): void {
        window.location.href = CONST.JIRA_LOGIN_URL;
    }
    public selectProject(project: JiraProject): void {
        this.projectKey = project.key;
        this.selectedProject = project;
        this.selectedTab = 'viz';
    }
    public newArrowChart(): void {
        if (this.selectedProject) {
            this.getJiraProject(this.selectedProject);
        }
    }
    public createJiraProject(): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            const createProjUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_PROJECT_PROPERTY_URL);
            // I found this id by loading the jira issues for a project, then looking an assignee id from one of the response issues the response.
            const leadAccountId = '5c741c367dae4b653384935c';
            const body = this.importer.getCreateJiraProjectBody(leadAccountId);
            // const project = this.project;
            // const projectTxt = JSON.stringify(project);
            // const bodyData = {
            //     string: projectTxt,
            // };
            // const body = JSON.stringify(bodyData);
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };

            const projCategoriesUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_PROJ_CATEGORIES_URL);
            this.httpClient.get(projCategoriesUrl, requestOptions).subscribe((res: any) => {
                console.log(res);
            });

            // const permissionSchemeUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_PERMISSION_SCHEME_URL);
            // this.httpClient.get(permissionSchemeUrl, requestOptions).subscribe((res: any) => {
            //     console.log(res);
            // });

            // const notificationSchemeUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_NOTIFICATION_SCHEME_URL);
            // this.httpClient.get(notificationSchemeUrl, requestOptions).subscribe((res: any) => {
            //     console.log(res);
            // });

            // for creating a project
            // const project = this.selectedProject;
            // const deleteProjUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_PROJECT_PROPERTY_URL, project!.key);
            this.httpClient.post(createProjUrl, body, requestOptions).subscribe((res: any) => {
                console.log(res);
            });

            /* Result:
            id: 10002
            key: "P1"
            self:"https://api.atlassian.com/ex/jira/b5155f7a-e0aa-4d26-a9c9-f55d206ecddf/rest/api/3/project/10002"*/
        }
    }
    public addIssuesToJiraProject(): void {
        const leadAccountId = '5c741c367dae4b653384935c';
        const issues = this.importer.mapProjectToJiraIssues(this.project!, this.selectedProject!.id, leadAccountId);

        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
        const requestOptions = { headers: headers };
        const issueTypeUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_ISSUE_TYPE_URL);
        this.httpClient.get(issueTypeUrl, requestOptions).subscribe((res: any) => {
            console.log(res);
        });

        const issueApiCalls$ = issues.map(issue => {
            const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
            const createIssueUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_ISSUE_URL);
            const body = JSON.stringify(issue);
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            return this.httpClient.post<SaveIssueResponse>(createIssueUrl, body, requestOptions);
        });
        forkJoin(issueApiCalls$).subscribe(res => {
            console.log(res);
        });
    }

    // Issues returning

    public deleteJiraProject(): void {
        if (confirm('Are you sure you want to delete this project?')) {
            const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
            if (auth_token !== null) {
                const project = this.selectedProject;
                const deleteProjUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_PROJECT_PROPERTY_URL, project!.key);
                let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
                const requestOptions = { headers: headers };
                this.httpClient.delete(deleteProjUrl, requestOptions).subscribe((res: any) => {
                    console.log(res);
                });
            }
        }
    }
    
}

// 1.2) add story points to issues in jira, then convert to days for activity duration
// implement a better version of zametekapi with resource dependencies, or implement it in TS, verify its up and running in azure.
// automatatically generate arrow diagram from backend when newArrowChart is called
// deploy new functions with jira token to azure
// get this crtical-pass repo into azure

// Add code to secrets
// Check in backend
// Unit tests with chat gpt
// TODO: add tags from jira to project (assigned persson will be a resource and a tag), show tags like in network viz, allow to edit
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

export interface SaveIssueResponse {
    id: string;
    key: string;
    self: string;
    transition: {
        status: number;
        errorCollection: {
            errorMessages: [];
            errors: {};
        };
    };
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
