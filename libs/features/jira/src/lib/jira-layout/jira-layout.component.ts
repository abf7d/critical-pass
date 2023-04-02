import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@critical-pass/shared/environments';
import * as CONST from '../constants';
import { CORE_CONST } from '@critical-pass/core';
import { Activity, Project } from '@critical-pass/project/types';
import { JiraImportMapperService, JiraIssueLinkBody, JiraProjectResult, SaveIssueResponse } from '@critical-pass/shared/file-management';
import { NodeConnectorService } from '@critical-pass/project/processor';
import { API_CONST, DashboardService, DASHBOARD_TOKEN, ProjectStorageApiService } from '@critical-pass/shared/data-access';
import urlJoin from 'url-join';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { DependencyCrawlerService, ProjectSanatizerService } from '@critical-pass/shared/project-utils';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { inflate, deflate, gzip, ungzip } from 'pako';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
    public issueType: string | null = null;
    public projName: string | null = null;
    public projKey: string | null = null;
    // public authToken: string | null = null;
    public authExpireTime: Date | null = null;
    public newProjectForm!: FormGroup;
    public me: User | null = null;
    public issuesProject: Project | null = null;
    constructor(
        private httpClient: HttpClient,
        private route: ActivatedRoute,
        private connector: NodeConnectorService,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private importer: JiraImportMapperService,
        private sanitizer: ProjectSanatizerService,
        private serializer: ProjectSerializerService,
        private depCrawler: DependencyCrawlerService,
        private fb: FormBuilder,
    ) {}
    public ngOnInit(): void {
        const code = this.route.snapshot.queryParams['code'];

        if (code) {
            this.getJiraToken(code);
        } else {
            this.getCloudId();
        }
        this.sub = this.dashboard.activeProject$.subscribe(project => {
            this.project = project;
        });

        this.newProjectForm = this.fb.group({
            key: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3), this.duplicateError('key')]],
            name: ['', [Validators.required, Validators.minLength(4), this.duplicateError('name')]],
            lead: ['', []],
            template: ['', []],
            issueType: ['', []],
        });
    }
    public duplicateError(field: string) {
        return (control: FormControl) => {
            if (field === 'key') {
                if (this.projects.find(x => x.key.toLocaleLowerCase() === control.value.toLocaleLowerCase())) {
                    return { duplicate: true };
                }
            }
            if (field === 'name') {
                if (this.projects.find(x => x.name.toLocaleLowerCase() === control.value.toLocaleLowerCase())) {
                    return { duplicate: true };
                }
            }
            return null;
        };
    }
    public onNewProjSubmit(): void {
        const key = this.newProjectForm.get('key')?.value;
        const name = this.newProjectForm.get('name')?.value;
        const lead = this.newProjectForm.get('lead')?.value;
        const template = this.newProjectForm.get('template')?.value;
        const issueType = this.newProjectForm.get('issueType')?.value;
        // this.createProject(key, name, lead, template, issueType);
    }
    public ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    public getMe(): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            const userUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_ME_URL);

            this.httpClient.get<User>(userUrl, requestOptions).subscribe(
                (res: any) => {
                    this.me = res;
                    console.log('users', res);
                },
                err => {
                    console.error('users resonse', err);
                },
            );
        }
    }

    public getJiraToken(code: string): void {
        this.httpClient.get<{ access_token: string }>(urlJoin(this.baseUrl, 'account/jira-token', code)).subscribe(
            res => {
                localStorage.setItem(CORE_CONST.JIRA_TOKEN_KEY, res.access_token);
                const expireMs = new Date().getTime() + 60 * 60 * 1000;
                localStorage.setItem(CORE_CONST.JIRA_TOKEN_EXPIRY_KEY, expireMs + '');
                this.getCloudId();
                this.authExpireTime = new Date(expireMs);
            },
            err => {
                console.error('token resonse', err);
                const expireMs = localStorage.getItem(CORE_CONST.JIRA_TOKEN_EXPIRY_KEY);
                if (expireMs) {
                    this.authExpireTime = new Date(parseInt(expireMs, 10));
                }
                this.getCloudId();
            },
        );
        return;
    }
    public getCloudId(): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            this.httpClient.get(CONST.JIRA_CLOUD_ID_URL, requestOptions).subscribe(
                (res: any) => {
                    this.cloudId = res[0].id;
                    this.getProjects();
                    this.getMe();
                },
                err => {
                    console.error('cloud id resonse', err);
                    this.toJira();
                },
            );
        }
    }

    // get the list of issue names from the result
    // public getIssueList(project: JiraProject) {
    //     const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
    //     if (auth_token !== null) {
    //         let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
    //         const requestOptions = { headers: headers };
    //         const projectUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, `${CONST.JIRA_PROJECT_QUERY}${project.key}`);
    //         this.httpClient.get<JiraProjectResult>(projectUrl, requestOptions).subscribe((res: any) => {
    //             this.convertIssuesToProject(res);
    //             const issues = this.project?.activities.filter(x => x.profile.name);
    //         });
    //     }
    // }

    public setJiraProject(project: JiraProject): void {
        this.getJiraProjectResult(project)?.subscribe((res: any) => {
            this.project = this.convertIssuesToProject(res);
            this.dashboard.activeProject$.next(this.project!);
        });
    }

    public getJiraProjectResult(project: JiraProject): Observable<JiraProjectResult> | null {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            const projectUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, `${CONST.JIRA_PROJECT_QUERY}${project.key}`);
            return this.httpClient.get<JiraProjectResult>(projectUrl, requestOptions); /*.subscribe((res: any) => {
                this.project = this.convertIssuesToProject(res);
            });*/
        }
        return null;
    }
    private convertIssuesToProject(response: JiraProjectResult): Project | null {
        const project = this.importer.mapJiraProject(response);
        if (project) {
            this.connector.connectArrowsToNodes(project);
        }
        return project;
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

    public async setProjectProperty(jiraProj: JiraProjectResponse | null = null): Promise<void> {
        let projKey = jiraProj?.key ?? this.selectedProject?.key;
        // const project = this.selectedProject;
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            const propertyKey = CONST.CP_PROPERTY_KEY;
            const copy = this.serializer.fromJson(this.project) as any;

            this.sanitizer.sanatizeForSave(copy);
            copy.profile.subProject = undefined;
            copy.profile.view = undefined;

            const projectTxt = JSON.stringify(copy);
            const binaryBody = deflate(projectTxt);
            const smaller = await this.importer.base64_arraybuffer(binaryBody);
            const bodyData = {
                string: smaller,
            };
            const body = JSON.stringify(bodyData);

            const propertyUrl = urlJoin(
                CONST.JIRA_QUERY_BASE_URL,
                this.cloudId!,
                CONST.JIRA_PROJECT_PROPERTY_URL,
                projKey!,
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
            this.httpClient.get(propertyUrl, requestOptions).subscribe(
                (res: any) => {
                    const propVal = res.value.string;
                    const decode64 = this.importer.base64StringToByteArray(propVal);
                    const inflated = inflate(decode64, { to: 'string' });
                    const json = JSON.parse(inflated);
                    const projectObj = this.serializer.fromJson(json);
                    this.connector.connectArrowsToNodes(projectObj);
                    projectObj.profile.view.autoZoom = true;
                    this.dashboard.activeProject$.next(projectObj);
                },
                error => {
                    this.setJiraProject(project!);
                },
            );
        }
    }

    public updateDependencies(): void {
        this.depCrawler.setDependencyDataFromGraph(this.project!);
    }

    public toJira(): void {
        // localStorage.removeItem(CORE_CONST.JIRA_TOKEN_KEY);
        // localStorage.removeItem(CORE_CONST.JIRA_TOKEN_EXPIRY_KEY);
        window.location.href = CONST.JIRA_LOGIN_URL;
    }
    public selectProject(project: JiraProject): void {
        this.projectKey = project.key;
        this.selectedProject = project;
        this.selectedTab = 'viz';
        this.getJiraProjectResult(project)?.subscribe((res: any) => {
            // this populates the jira issues in the ui by generating project and using activities
            this.issuesProject = this.convertIssuesToProject(res);

            // Populate the arrow chart from the jira project's property
            this.getProjectProperty();
        });
    }
    public newArrowChart(): void {
        if (this.selectedProject) {
            this.setJiraProject(this.selectedProject);
        }
    }
    public setIssueType(target: any) {
        this.issueType = target.value;
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

            // const projCategoriesUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_PROJ_CATEGORIES_URL);
            // this.httpClient.get(projCategoriesUrl, requestOptions).subscribe((res: any) => {
            //     console.log(res);
            // });

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
    public issueTypes: IssueType[] = [];
    public projIssueTypes: IssueType[] = [];
    public getIssueTypes(): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
        const requestOptions = { headers: headers };
        const issueTypeUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_ISSUE_TYPE_URL);
        this.issueTypes = [];
        this.httpClient.get<IssueTypeResponse[]>(issueTypeUrl, requestOptions).subscribe(res => {
            console.log(res);
            res.forEach(issueType => {
                const issueTypeObj = {
                    id: issueType.id,
                    description: issueType.description,
                    projectId: issueType.scope?.project?.id,
                };
                this.issueTypes.push(issueTypeObj);
                if (issueTypeObj.projectId === this.selectedProject?.id) {
                    this.projIssueTypes.push(issueTypeObj);
                }
            });
        });
    }

    // TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!--------------------------------------------------------------
    // this adds issue keys to arrows then saves the project to jira after the issues are created
    // need to alter the createIssueLink and createIssueLinkBody to use the project for dependencies and issues for keys
    // to dynamically generate links
    // Then have one button that says "Save to Jira" and it will create the project and issues and links
    // Every time you bring down a project you will need to compare the (bring down) issues, links, and project activity arrows and update the
    // project property/arrowchart json in order to keep jira adn the arrow chart up to date. If there are differences, you will
    // need to add (in defualt positions) / remove activities.
    // have a button "create a new project" that will create a new project, issues, issue links in jira and a new arrow chart json file
    // have a button "update project" that will use PUT to update the project, issues, issue links in jira and the arrow chart json file

    // Just added create project logic, need to test this out. it createss everything at once
    // need to add input files for leadAccountId, project name, project key, project description, project lead, etc
    // public createProjWithIssuesAndArrowChartInJira(): void {
    public createFullJiraProject(): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        const leadAccountId = this.me!.accountId;
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
        const requestOptions = { headers: headers };
        const key = this.newProjectForm.get('key')?.value;
        const name = this.newProjectForm.get('name')?.value;
        const createProjectBody = this.importer.getCreateJiraProjectBody(leadAccountId, key, name);
        const createProjUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_PROJECT_PROPERTY_URL);

        // create project
        this.httpClient.post<JiraProjectResponse>(createProjUrl, createProjectBody, requestOptions).subscribe(
            (projCreationRes: any) => {
                console.log('create project', projCreationRes);
                const newProjId = '' + projCreationRes.id;

                // need to refactor this into multiple functions
                // getNewProjectIssueTypes
                const issueTypeKey = 'Task';
                const issueTypeUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_ISSUE_TYPE_URL);
                this.issueTypes = [];
                this.httpClient.get<IssueTypeResponse[]>(issueTypeUrl, requestOptions).subscribe(
                    issueTypRes => {
                        console.log(issueTypRes);
                        issueTypRes.forEach(issueType => {
                            const issueTypeObj = {
                                id: issueType.id,
                                description: issueType.description,
                                projectId: issueType.scope?.project?.id,
                            };
                            this.issueTypes.push(issueTypeObj);
                            if (issueTypeObj.projectId === newProjId) {
                                this.projIssueTypes.push(issueTypeObj);
                            }
                        });
                        const issueType = this.projIssueTypes.find(iType => iType.projectId === newProjId && iType.description.indexOf(issueTypeKey) > -1);
                        if (issueType) {
                            // GenerateIssueLinks and setProjProperty and refreshProjectList
                            const issueTypeIdTask = issueType.id;
                            const nonDummies = this.project!.activities.filter(x => !x.chartInfo.isDummy);
                            const issues = this.importer.mapProjectToJiraIssues(
                                nonDummies,
                                /*this.selectedProject!.id*/ newProjId,
                                leadAccountId,
                                issueTypeIdTask,
                            );

                            const issueApiCalls$ = issues.map(issue => {
                                const createIssueUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_ISSUE_URL);
                                const body = JSON.stringify(issue);
                                return this.httpClient.post<SaveIssueResponse>(createIssueUrl, body, requestOptions);
                            });
                            forkJoin(issueApiCalls$).subscribe(
                                res => {
                                    this.importer.addIssueKeysToArrows(nonDummies, res);
                                    const links = this.importer.getIssueLinks(this.project!);
                                    this.createIssueLinks(links);
                                    this.setProjectProperty(projCreationRes);
                                    console.log(res);
                                    this.getProjects();
                                },
                                err => {
                                    console.error('error creating jira issues', err);
                                },
                            );
                        }
                    },
                    err => {
                        console.error('error getting issue types', err);
                    },
                );
            },
            err => {
                console.error('error creating jira base project', err);
            },
        );
    }

    public addIssuesToJiraProject(): void {
        const leadAccountId = '5c741c367dae4b653384935c';
        const issueTypeIdTask = this.issueType; //'10018'
        if (!issueTypeIdTask) {
            return;
        }
        const nonDummies = this.project!.activities.filter(x => !x.chartInfo.isDummy);

        const issues = this.importer.mapProjectToJiraIssues(nonDummies, this.selectedProject!.id, leadAccountId, issueTypeIdTask);

        const issueApiCalls$ = issues.map(issue => {
            const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
            const createIssueUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_ISSUE_URL);
            const body = JSON.stringify(issue);
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            return this.httpClient.post<SaveIssueResponse>(createIssueUrl, body, requestOptions);
        });
        forkJoin(issueApiCalls$).subscribe(res => {
            this.importer.addIssueKeysToArrows(nonDummies, res);
            const links = this.importer.getIssueLinks(this.project!);
            this.createIssueLinks(links);
            this.setProjectProperty();
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
                    // TODO add keys to the arrows from here res[0].key, then from the arrow diagram create issue links
                    this.getProjects();
                });
            }
        }
    }
    public createIssueLink(): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            const createIssueLinkUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_ISSUE_LINK_URL);
            const issueTarget = 'P1-10';
            const dependencyIssue = 'P1-8';
            const body = this.importer.createIssueLinkBody(dependencyIssue, issueTarget);
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            this.httpClient.post(createIssueLinkUrl, body, requestOptions).subscribe((res: any) => {
                console.log(res);
            });
        }
    }
    public createIssueLinks(links: JiraIssueLinkBody[]): void {
        const auth_token = localStorage.getItem(CORE_CONST.JIRA_TOKEN_KEY);
        if (auth_token !== null) {
            const createIssueLinkUrl = urlJoin(CONST.JIRA_QUERY_BASE_URL, this.cloudId!, CONST.JIRA_ISSUE_LINK_URL);
            let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${auth_token}`);
            const requestOptions = { headers: headers };
            const issueLinkApiCalls$ = links.map(linkBody => {
                // const body = JSON.stringify(link);
                return this.httpClient.post(createIssueLinkUrl, linkBody, requestOptions);
            });
            forkJoin(issueLinkApiCalls$).subscribe(res => {
                console.log('issueLinks created', res);
            });
        }
    }
    public setProjName(event: Event) {
        this.projName = (event.target as HTMLInputElement).value;
    }
    public setProjKey(event: Event) {
        this.projKey = (event.target as HTMLInputElement).value;
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
export interface JiraProjectResponse {
    id: string;
    key: string;
    self: string;
}

export interface IssueType {
    description: string;
    id: string;
    projectId?: string;
}
export interface IssueTypeResponse {
    id: string;
    description: string;
    scope?: {
        project: { id: string };
    };
}
export interface User {
    self: string;
    accountId: string;
    accountType: string;
    displayName: string;
    emailAddress: string;
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
