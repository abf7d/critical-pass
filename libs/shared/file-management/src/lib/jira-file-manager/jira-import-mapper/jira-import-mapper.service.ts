import { Injectable } from '@angular/core';
import { Activity, Project, TagGroupOption } from '@critical-pass/project/types';
import { TagManagerService } from '@critical-pass/shared/project-utils';
import { ActivitySerializerService, IntegrationSerializerService, ProjectSerializerService } from '@critical-pass/shared/serializers';
import { JiraIssueExport, JiraProjectResult } from '../../types/jira';
import * as CONST from '../../constants';
@Injectable({
    providedIn: 'root',
})
export class JiraImportMapperService {
    constructor(
        private projectSerializer: ProjectSerializerService,
        private actSerializer: ActivitySerializerService,
        private intSerializer: IntegrationSerializerService,
        private tagManager: TagManagerService,
    ) {}

    public mapJiraProject(response: JiraProjectResult): Project | null {
        const issues = response.issues;
        const idMap = new Map<string, number>();
        const project = this.projectSerializer.fromJson();
        if (issues.length > 0) {
            project.profile.name = issues[0].fields.project?.name ?? 'Jira Project';
            project.profile.id = -1;
            issues.forEach((issue, i) => {
                idMap.set(issue.key, i);
            });
            const assignedTo = issues.map(x => x.fields.assignee?.displayName!).filter(x => !!x);
            this.tagManager.addTagGroup(project, CONST.RESOURCE_TAG_GROUP, assignedTo);
            issues.forEach(issue => {
                const activity = this.actSerializer.fromJson();
                const id = idMap.get(issue.key);
                if (id !== undefined) {
                    activity.profile.id = id;
                    activity.profile.name = issue.fields.summary;
                    activity.profile.jiraIssueKey = issue.key;
                    // activity.profile. = issue.fields.description;
                    activity.profile.planned_completion_date = issue.fields.duedate;

                    // activity.type = issue.fields.issuetype.name;
                    // activity.status = issue.fields.issuetype.name;
                    // activity.assignedTo = issue.fields.creator?.displayName;
                    // activity.createdBy = issue.fields.creator?.displayName;
                    // activity.createdDate = issue.fields.created;
                    // activity.project = issue.fields.project?.key;
                    // idMap.set(issue.key, id);
                    activity.profile.duration = issue.fields.customfield_10016 / 2;

                    // Todo: test this to see if the tag is added to the project and activities
                    this.tagManager.addTagToActivities(project, issue.fields.assignee?.displayName!, CONST.RESOURCE_TAG_GROUP, [activity]);
                    if (issue.fields.issuelinks) {
                        const dependencies = issue.fields.issuelinks
                            ?.filter(x => !!x.inwardIssue)
                            .map(link => {
                                if (link.inwardIssue?.key && link.type?.inward === 'is blocked by') {
                                    return idMap.get(link.inwardIssue?.key);
                                }
                                return null;
                            });
                        if (dependencies?.length) {
                            activity.profile.depends_on = (dependencies?.filter(x => x !== null) as number[]).join(',');
                        }
                    }
                    project.activities.push(activity);
                }
            });
            this.generateNodes(project);
            return project;
        }
        return null;
    }

    public generateNodes(project: Project) {
        let id = 0;
        const intFactory = this.intSerializer;
        project.activities.forEach((a, i) => {
            a.chartInfo.source_id = ++id;
            const source = intFactory.fromJson({ id, name: id });

            a.chartInfo.target_id = ++id;
            const target = intFactory.fromJson({ id, name: id });

            const div = Math.floor(i / 20);
            const rem = i % 20;

            source.x = 50 + 120 * div;
            source.y = 40 * (rem + 1);
            target.x = 120 + 120 * div;
            target.y = 40 * (rem + 1);

            project.integrations.push(source);
            project.integrations.push(target);
        });
    }

    public mapProjectToJiraIssues(project: Project, projId: string, projName: string, projKey: string, assigneeId: string): JiraIssueExport[] {
        // const issues: JiraIssueExport[] = [];
        const nonDummies = project.activities.filter(x => !x.chartInfo.isDummy);
        const issues: JiraIssueExport[] = nonDummies.map(activity => {
            const issue = {
                fields: {
                    // issuetype: {
                    //     id: '10000',

                    //   },
                    summary: activity.profile.name!,
                    // description: {content: [{content:[{text: "TODO: add description to activity object", type: "text"}], type: "paragraph"}], version: 1},
                    description: 'TODO: add description to activity object',
                    // parent: {
                    //     // the key should be of format CP-123 and should be the parent issue
                    //     key: activity.profile.jiraIssueKey,
                    // }

                    // TODO Generate project first then populate these fields
                    // also will need to get the user id that approves jira access and use their id in for assignee
                    project: {
                        id: projId,
                        key: projKey,
                        name: projName, // project.profile.name,
                    },
                    assignee: {
                        // name: 'Aaron Friedman',
                        id: assigneeId,
                    },
                    customfield_10016: activity.profile.duration! * 2,
                    // versions: [
                    //     {
                    //       id: "10000"
                    //     }
                },
            };
            return issue;
            // issues.push(issue);
        });
        return issues;
    }

    //https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-links/#api-rest-api-3-issuelink-post
    public createIssueLinkBody(inIssueKey: string, outIssueKey: string): JiraIssueLinkBody {
        const bodyData = {
            comment: {
                body: {
                    content: [
                        {
                            content: [
                                {
                                    text: 'Linked related issue!',
                                    type: 'text',
                                },
                            ],
                            type: 'paragraph',
                        },
                    ],
                    type: 'doc',
                    version: 1,
                },
                visibility: {
                    identifier: '276f955c-63d7-42c8-9520-92d01dca0625',
                    type: 'group',
                    value: 'jira-software-users',
                },
            },
            inwardIssue: {
                key: inIssueKey,
            },
            outwardIssue: {
                key: outIssueKey//"MKY-1"
            },
            type: {
                //"name": "Duplicate"
                name: 'is blocked by',
            },
        };
        return bodyData;

        /*fetch('https://your-domain.atlassian.net/rest/api/3/issueLink', {
            method: 'POST',
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
            .catch(err => console.error(err)); */
    }

    // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-projects/#api-rest-api-3-project-post
    public getCreateJiraProjectBody(/*project: Project,**/ leadAccountId: string): JiraProjectBody {
        // {"errorMessages":["An invalid project template was specified. Make sure the project template matches the project type you specified."],"errors":{}}
        const bodyData = {
            assigneeType: 'UNASSIGNED', // other value is  'PROJECT_LEAD'
            // avatarId: 10200,
            // categoryId: 10120,
            description: 'Project Design sample project 1',
            issueSecurityScheme: 10001,
            key: 'P1',
            leadAccountId: leadAccountId, //'5b10a0effa615349cb016cd8', // need to get this from user that is approving jira access
            name: 'Project 1',
            notificationScheme: 10000, // 10002 is CE, 10001 is CP, 10000 is default
            permissionScheme: 0,// 0 is the default permission scheme  10001 is cyto-explorer simplified, 10000 is crtitical pass simplified,
            projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-agility-kanban', //'com.atlassian.jira-core-project-templates:jira-core-simplified-process-control',
            projectTypeKey: 'software',
            url: 'http://atlassian.com',
        };

//        const x = {
//            entityId
//             : 
//             "1c443fe2-878a-4167-be3f-9dedaf66721c"
//             expand
//             : 
//             "description,lead,issueTypes,url,projectKeys,permissions,insight"
//             id
//             : 
//             "10001"
//             isPrivate
//             : 
//             false
//             key
//             : 
//             "CE"
//             name
//             : 
//             "Cyto Explorer"
//             projectTypeKey
//             : 
//             "software"
//             properties
//             : 
//             {}
//             self
//             : 
//             "https://api.atlassian.com/ex/jira/b5155f7a-e0aa-4d26-a9c9-f55d206ecddf/rest/api/3/project/10001"
//             simplified
//             : 
//             true
//             style
//             : 
//             "next-gen"
//             uuid
// : 
// "1c443fe2-878a-4167-be3f-9dedaf66721c"


/*
assignee
: 
accountId
: 
"5c741c367dae4b653384935c"
accountType
: 
"atlassian"
active
: 
true
avatarUrls
: 
{48x48: 'https://secure.gravatar.com/avatar/6d5cc5978f7c586…-2.prod.public.atl-paas.net%2Finitials%2FAF-0.png', 24x24: 'https://secure.gravatar.com/avatar/6d5cc5978f7c586…-2.prod.public.atl-paas.net%2Finitials%2FAF-0.png', 16x16: 'https://secure.gravatar.com/avatar/6d5cc5978f7c586…-2.prod.public.atl-paas.net%2Finitials%2FAF-0.png', 32x32: 'https://secure.gravatar.com/avatar/6d5cc5978f7c586…-2.prod.public.atl-paas.net%2Finitials%2FAF-0.png'}
displayName
: 
"Aaron Friedman"
emailAddress
: 
"afriedman111@gmail.com"
self
: 
"https://api.atlassian.com/ex/jira/b5155f7a-e0aa-4d26-a9c9-f55d206ecddf/rest/api/3/user?accountId=5c741c367dae4b653384935c"
timeZone
: 
"America/New_York"*/



//         }
        return bodyData;
       /* fetch('https://your-domain.atlassian.net/rest/api/3/project', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from('email@example.com:<api_token>').toString('base64')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: bodyData,
        })
            .then(response => {
                console.log(`Response: ${response.status} ${response.statusText}`);
                return response.text();
            })
            .then(text => console.log(text))
            .catch(err => console.error(err)); */
    }
}


// create interface for createIssueLinkBody
export interface JiraIssueLinkBody {
    comment: {
        body: {
            content: 
                {
                    content: 
                        {
                            text: string;
                            type: string;
                        }[];
                    type: string;
                }[];
            type: string;
            version: number;
        };
        visibility: {
            identifier: string;
            type: string;
            value: string;
        };
    };
    inwardIssue: {
        key: string;
    };
    outwardIssue: {
        key: string;
    };
    type: {
        name: string;
    };
}

// create interface for createJiraProject
export interface JiraProjectBody {
    assigneeType: string;
    // avatarId: number;
    // categoryId: number;
    description: string;
    issueSecurityScheme: number;
    key: string;
    leadAccountId: string;
    name: string;
    notificationScheme: number;
    permissionScheme: number;
    projectTemplateKey: string;
    projectTypeKey: string;
    url: string;
}