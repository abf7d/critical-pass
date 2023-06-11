import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { lightFormat } from 'date-fns';
import { DashboardService, DASHBOARD_TOKEN, EventService, ProjectApi, EVENT_SERVICE_TOKEN, PROJECT_API_TOKEN } from '@critical-pass/shared/data-access';
import { MilestoneFactoryService, ParentCompilerService, UTIL_CONST } from '@critical-pass/shared/project-utils';
import { Activity, Integration, Project } from '@critical-pass/project/types';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { P_CONST } from '@critical-pass/project/processor';
import { CORE_CONST } from '@critical-pass/core';

@Injectable({
    providedIn: 'root',
})
export class SelectedActivityControllerService {
    drawChannel$!: BehaviorSubject<any>;
    activeProject$!: Observable<Project>;
    prntUpdate$!: BehaviorSubject<any>;

    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        @Inject(PROJECT_API_TOKEN) private projectApi: ProjectApi,
        private parentCompiler: ParentCompilerService,
        private milestoneFactory: MilestoneFactoryService,
        private projectSerializer: ProjectSerializerService,
    ) {}

    ngOnInit() {
        this.drawChannel$ = this.eventService.get(UTIL_CONST.ACTIVITY_CREATED_KEY);
        this.activeProject$ = this.dashboard.activeProject$;
    }

    public setDuration(duration: string, activity: Activity, project: Project) {
        if (activity !== null) {
            activity.profile.duration = +duration;
            if (project.profile.parentProject != null) {
                this.parentCompiler.compile(project);
                this.updateProject(project);
                this.dashboard.secondaryProject$.next(project.profile.parentProject);
            } else {
                this.updateProject(project);
            }
        }
    }

    public setName(name: string, activity: Activity, project: Project) {
        if (activity !== null) {
            activity.profile.name = name;
            this.updateProject(project);
        }
    }

    public setPcd(pcd: string, activity: Activity, project: Project) {
        if (activity !== null) {
            activity.profile.planned_completion_date = pcd;
            this.updateProject(project);
        }
    }

    public setFinish(finish: string, activity: Activity, project: Project) {
        if (activity !== null) {
            activity.profile.finish = finish;
            this.updateProject(project);
        }
    }

    public setSubGraphId(id: string, activity: Activity, project: Project) {
        if (activity !== null) {
            activity.subProject.subGraphId = +id;
            this.updateProject(project);
        }
    }

    public setIsDummy(checked: boolean, activity: Activity, project: Project) {
        if (activity !== null) {
            activity.chartInfo.isDummy = checked;
            this.updateProject(project);
        }
    }

    public setIsNDummy(checked: boolean, node: Integration, project: Project) {
        if (node !== null) {
            node.isDummy = checked;
            this.updateProject(project);
        }
    }

    public generateMilestone(node: Integration, project: Project) {
        this.milestoneFactory.createMilestone(project, node);
        this.updateProject(project);
    }

    public revertMilestone(node: Integration, project: Project) {
        this.milestoneFactory.changeBackToNonMilestone(node, project);
        this.updateProject(project);
    }

    public updateProject(project: Project) {
        this.dashboard.updateProject(project, true);
    }

    public updateSelectedActivity(activity: Activity, project: Project) {
        project.profile.view.selectedActivity = activity;
    }

    public loadSubProject(activity: Activity, curProj: Project, projectPool: Project[] | null): void {
        let project = null;
        if (projectPool && projectPool.length > 0) {
            project = projectPool.find(x => x.profile.id === activity.subProject.subGraphId);
            if (project) {
                this.swapProjWithSubProj(project, activity, curProj);
                return;
            }
        }
        if (activity.subProject.subGraphLoaded == null) {
            const childProject = this.dashboard.cache.get(activity.subProject.subGraphId);
            if (childProject) {
                this.loadChildAndParentProjects(activity, curProj, childProject, projectPool);
            } else {
                this.projectApi.get(activity.subProject.subGraphId).subscribe(childProject => {
                    this.loadChildAndParentProjects(activity, curProj, childProject, projectPool);
                });
            }
        } else {
            this.swapProjWithSubProj(activity.subProject.subGraphLoaded, activity, curProj);
        }
    }
    public loadChildAndParentProjects(activity: Activity, project: Project, childProject: Project, projectPool: Project[] | null): void {
        childProject.profile.parentProject = project;
        activity.subProject.subGraphLoaded = childProject;
        // TODO: activityParentId and parentProjectId get set when a new project is created, these lines are temporary to create new file
        // so remove these lines
        // They potentially break saving loading to the backend, need to test saving/loading project with subproject
        // can always remove parentProjectId from serializer for now
        childProject.profile.subProject.activityParentId = activity.profile.id;
        childProject.profile.parentProjectId = project.profile.id;

        childProject.profile.view.autoZoom = true;
        this.dashboard.updateProject(childProject, true);
        this.dashboard.secondaryProject$.next(project);
    }

    public swapProjWithSubProj(subProj: Project, activity: Activity, project: Project) {
        // Set the sub project of the activity so when we comeback to the parent and load the subgraph
        // again, the already loaded sub graph with previous changes will load
        activity.subProject.subGraphLoaded = subProj;

        // Change uninitialized project id (-1) to new project id (0) for reloading project on revisit
        if (activity.subProject.subGraphId === -1) {
            activity.subProject.subGraphId = 0;
            subProj.profile.id = 0;
        }

        // Parent project helps us return to the parent project
        subProj.profile.parentProject = project;
        subProj.profile.view.autoZoom = true;

        // need this so when a new sub project is created, it can be added to the proper activity
        // TODO: activityParentId and parentProjectId get set when a new project is created, these lines are temporary to create new file
        // so remove these lines
        subProj.profile.subProject.activityParentId = activity.profile.id;
        subProj.profile.parentProjectId = project.profile.id;

        this.dashboard.updateProject(subProj, true);

        // TODO: do we need to compile the project here?
        this.dashboard.secondaryProject$.next(project);
    }

    public createSubProject(activity: Activity, project: Project, projectPool: Project[] | null) {
        // when new network analysis file is loaded, it can have projs with id < -1
        // since each network is different this needs to be loaded here to determine
        // the count so the next project id can be determined
        // const subProjCount$ = this.pManager.getChannel(AppKeys.networkSubProjTracker);
        const subProjCount$ = this.eventService.get<number>(UTIL_CONST.NETWORK_SUB_PROJECT_TRACKER);

        // const subProj = new ProjectSerializerService().fromJson(null);
        const subProj = this.projectSerializer.fromJson(null);
        let subProjCount = subProjCount$.getValue();
        // -1 is expected for uninitialized project, < -1 is a new subproject > -1 has been saved to databse
        if (subProjCount === undefined) {
            subProjCount = -2;
        }
        subProj.profile.id = subProjCount;
        subProj.profile.name = activity.profile.name ?? 'New Sub Project';
        subProj.profile.parentProjectId = project.profile.id;
        subProj.profile.subProject.activityParentId = activity.profile.id;
        --subProjCount;
        subProjCount$.next(subProjCount);
        this.eventService.get(CORE_CONST.CREATED_PROJECT).next(subProj);
        this.swapProjWithSubProj(subProj, activity, project);
    }

    public destroy() {
        this.eventService.get(CORE_CONST.CREATED_PROJECT).next(null);
    }

    public formatDate(date: Date) {
        if (date == null) {
            return undefined;
        }
        return lightFormat(date, P_CONST.MAIN_DATE_FORMAT);
    }
    public updateDate(date: Date, field: string, activity: Activity, project: Project) {
        switch (field) {
            case 'finish':
                activity.profile.finish = this.formatDate(date);
                activity.profile.finish_dt = date;
                break;
            case 'start_date':
                activity.profile.start_date = this.formatDate(date);
                activity.profile.start_date_dt = date;
                break;
            case 'pcd':
                activity.profile.planned_completion_date = this.formatDate(date);
                activity.profile.planned_completion_date_dt = date;
                break;
        }
        this.updateProject(project);
    }

    public setLabel(label: string, selectedNode: Integration, project: Project) {
        selectedNode.label = label;
        this.updateProject(project);
    }
}
