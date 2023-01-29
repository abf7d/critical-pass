import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ProjectManagerBase, TagGroupOption } from '@critical-pass/critical-charts';
// import { Project, ResourceSerializerService } from '@critical-pass/critical-charts';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
// import { ChartKeys } from '@critical-pass/critical-charts';
// import { AssignFrameworkService } from '../../services/utils/assign/assign-framework/assign-framework.service';
// import { ResourceFactoryService } from '../../services/utils/assign/resource-factory/resource-factory.service';
// import { PhaseFactoryService } from '../../services/utils/assign/phase-factory/phase-factory.service';
// import { ColorFactoryService } from '../../services/utils/assign/color-factory/color-factory.service';
import { MetaTagService } from './meta-tag.service';
// import { TagSelection, TagLoad, TagSelectionGroup } from '../../../../core/models/tag-models';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { Project, TagGroupOption, TagLoad, TagSelection, TagSelectionGroup } from '@critical-pass/project/types';
import { ColorFactoryService } from '@critical-pass/shared/serializers';

@Component({
    selector: 'proj-meta-tags',
    templateUrl: './meta-tags.component.html',
    styleUrls: ['./meta-tags.component.scss'],
})
export class MetaTagsComponent implements OnInit {
    public id: number;
    public project$: Observable<Project>;
    public project!: Project;
    public subscription!: Subscription;
    public isResourceView = true;
    public tagGroups: TagSelectionGroup;
    public availableGroups: TagSelectionGroup[] = [];
    public activeGroup: TagSelectionGroup | null = null;
    constructor(
        route: ActivatedRoute,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private colorFactory: ColorFactoryService,
        private metaTagService: MetaTagService,
    ) {
        this.id = +route.snapshot.params['id'];
        this.project$ = this.dashboard.activeProject$;
        this.tagGroups = { name: 'Tag Group', tags: [] };
        this.availableGroups = [];
    }
    public ngOnInit(): void {
        this.subscription = this.project$.pipe(filter(x => !!x)).subscribe(project => {
            if (project !== this.project) {
                const tagInfo: TagLoad = { tags: [], groups: [], activeGroup: null };
                this.metaTagService.loadTags(project, tagInfo);
                this.tagGroups.tags = tagInfo.tags;
                this.availableGroups = tagInfo.groups;
                this.activeGroup = tagInfo.activeGroup;
            }
            this.project = project;
        });
    }
    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
    public assignToActivities(tags: string[]) {
        this.metaTagService.assignTagsToSelectedActivities(this.project, tags, this.activeGroup!);
        this.dashboard.updateProject(this.project, true);
    }
    public unassignFromActivities() {
        this.metaTagService.unassignFromActivities(this.activeGroup!.name, this.project);
        this.dashboard.updateProject(this.project, true);
    }
    public selectTag(resource: any) {
        const type = 'resource';
    }
    public removeTag(tag: TagSelection) {
        if (this.activeGroup !== null && this.project !== undefined && this.project.tags !== undefined) {
            this.activeGroup.tags.splice(this.activeGroup.tags.indexOf(tag), 1);
            const index = this.project.tags.find(x => x.name === this.activeGroup!.name)?.tags.indexOf(tag);
            if (index && index > -1) {
                this.project.tags.find(x => x.name === this.activeGroup!.name)?.tags.splice(index, 1);
            }
            this.metaTagService.removeTagFromActivities(this.project, this.activeGroup.name, tag);
            this.dashboard.updateProject(this.project, true);
        }
    }
    public addTag(name: any) {
        if (this.activeGroup !== null) {
            const schemeIndex = this.availableGroups.indexOf(this.activeGroup); //+ 7;
            const newTag = this.creatNewTag(name, this.activeGroup.tags.length, schemeIndex);
            this.activeGroup.tags.push(newTag);
            if (this.project.tags) {
                this.project.tags.find(x => x.name === this.activeGroup!.name)?.tags.push(newTag);
                this.dashboard.updateProject(this.project, true);
            }
        }
    }
    public selectGroup(name: any) {
        if (this.project.profile.view.selectedTagGroup === name) {
            this.project.profile.view.selectedTagGroup = null;
            this.activeGroup = null;
        } else {
            const activeGroup = this.availableGroups.find(x => x.name === name);
            if (activeGroup) {
                this.activeGroup = activeGroup;
            }
            this.project.profile.view.selectedTagGroup = name;
        }
        this.dashboard.updateProject(this.project, true);
    }
    public removeGroup(tag: TagSelection) {
        this.tagGroups.tags.splice(this.tagGroups.tags.indexOf(tag), 1);
        const groupIndex = this.availableGroups.findIndex(x => x.name === tag.name);

        if (groupIndex > -1) {
            this.metaTagService.removeTagGroupFromProject(this.project, tag);
            this.availableGroups.splice(groupIndex, 1);
        }
        this.dashboard.updateProject(this.project, true);
    }
    public addGroup(name: any) {
        const newTag = this.creatNewTag(name, this.tagGroups.tags.length, 0);
        this.tagGroups.tags.push(newTag);

        const newSelectionGroup: TagSelectionGroup = { name, tags: [] };
        this.availableGroups.push(newSelectionGroup);

        const newTagGroupOption: TagGroupOption = { name, tags: [], color: newTag.color, backgroundcolor: newTag.backgroundcolor };
        this.metaTagService.addTagGroupToProject(this.project, newTagGroupOption);
        this.dashboard.updateProject(this.project, true);
    }
    public creatNewTag(name: string, nameIndex: number, groupIndex: number): TagSelection {
        const scheme = this.colorFactory.getSchemeByIndex(groupIndex);
        const color = scheme.colors[nameIndex % scheme.colors.length];
        return {
            name,
            color: color.color,
            backgroundcolor: color.backgroundcolor,
            isSelected: false,
        };
    }
}
