import { Injectable } from '@angular/core';
import { Activity, Project, TagGroupOption } from '@critical-pass/project/types';
import { TagManagerService } from '@critical-pass/shared/project-utils';
import { ActivitySerializerService, IntegrationSerializerService, ProjectSerializerService } from '@critical-pass/shared/serializers';
import { JiraProjectResult } from '../../types/jira';
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
            console.log('res', response);

            const assignedTo = issues.map(x => x.fields.assignee?.displayName).filter(x => !!x);
            this.tagManager.addTagGroup(project, CONST.RESOURCE_TAG_GROUP, assignedTo);

            issues.forEach(issue => {
                const activity = this.actSerializer.fromJson();
                const id = idMap.get(issue.key);
                if (id !== undefined) {
                    activity.profile.id = id;
                    activity.profile.name = issue.fields.summary;
                    // activity.profile. = issue.fields.description;
                    activity.profile.planned_completion_date = issue.fields.duedate;

                    // activity.type = issue.fields.issuetype.name;
                    // activity.status = issue.fields.issuetype.name;
                    // activity.assignedTo = issue.fields.creator?.displayName;
                    // activity.createdBy = issue.fields.creator?.displayName;
                    // activity.createdDate = issue.fields.created;
                    // activity.project = issue.fields.project?.key;
                    // idMap.set(issue.key, id);
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
}
