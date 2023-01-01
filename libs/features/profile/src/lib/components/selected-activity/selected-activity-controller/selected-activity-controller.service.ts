import { Inject, Injectable } from '@angular/core';
import { Activity } from '@critical-pass/critical-charts';
import { Project } from '@critical-pass/critical-charts';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ChartKeys } from '@critical-pass/critical-charts';
import * as AppKeys from '../../../../../../core/constants/keys';
import { filter } from 'rxjs/operators';
import { ProjectStoreService } from '../../../../services/api/project-store/project-store.service';
import { ProjectSerializerService } from '@critical-pass/critical-charts';
import { lightFormat, sub } from 'date-fns';
import { Integration } from '@critical-pass/critical-charts';
import { MilestoneFactoryService } from '@critical-pass/critical-charts'; 
import { ProjectManagerBase } from '@critical-pass/critical-charts';

@Injectable({
    providedIn: 'root',
})
export class SelectedActivityControllerService {
    id: number;
    parentData: BehaviorSubject<any>;
    drawChannel$: BehaviorSubject<any>;
    data$: Observable<Project>;
    prntUpdate$: BehaviorSubject<any>;

    constructor(@Inject('ProjectManagerBase') private pManager: ProjectManagerBase, private projectStore: ProjectStoreService, private milestoneFactory: MilestoneFactoryService) {}

    ngOnInit(id: number) {
        if (id == null) {
            return;
        }
        this.id = id;
        this.drawChannel$ = this.pManager.getChannel(ChartKeys.activtyCreatedKey);
        this.data$ = this.pManager.getProject(this.id);
        this.prntUpdate$ = this.pManager.getChannel(AppKeys.updateParentProject);
    }

    public setDuration(duration: string, activity: Activity, project: Project) {
        if (activity !== null) {
            activity.profile.duration = +duration;
            if (project.profile.parentProject != null) {
                this.pManager.calculateParentProjRisk(this.id, project);
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
        this.pManager.updateProject(+this.id, project, true);
    }

    public updateSelectedActivity(activity: Activity, project: Project) {
        project.profile.view.selectedActivity = activity;
      }

    public loadSubProject(activity: Activity, curProj: Project, projectPool?: Project[]): Subject<Project> {
        let project = null;
        if (projectPool && projectPool.length > 0){
            project = projectPool.find(x => x.profile.id === activity.subProject.subGraphId);
            if (project) {
                this.swapProjWithSubProj(project, activity, curProj);
                return;
            }
        }
        if (activity.subProject.subGraphLoaded == null) {
            this.projectStore
                .load(activity.subProject.subGraphId)
                .pipe(filter(x => !!x))
                .subscribe(childProject => {
                    childProject.profile.parentProject = curProj;
                    activity.subProject.subGraphLoaded = childProject;
                    childProject.profile.subProject.activityParentId = activity.profile.id;
                    childProject.profile.view.autoZoom = true;
                    this.pManager.updateProject(ChartKeys.parentKey, curProj, false);
                    this.pManager.updateProject(this.id, childProject, true);
                });
        } else {
            this.swapProjWithSubProj(activity.subProject.subGraphLoaded, activity, curProj);
        }
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
        subProj.profile.subProject.activityParentId = activity.profile.id;
        this.pManager.updateProject(this.id, subProj, true);
        this.pManager.updateProject('parent', subProj.profile.parentProject, true);
    }
    public createSubProject(activity: Activity, project: Project, projectPool?: Project[]) {
        // when new network analysis file is loaded, it can have projs with id < -1
        // since each network is different this needs to be loaded here to determine
        // the count so the next project id can be determined 
        const subProjCount$ = this.pManager.getChannel(AppKeys.networkSubProjTracker);
        const subProj = new ProjectSerializerService().fromJson(null);
        let subProjCount = subProjCount$.getValue();
        // -1 is expected for uninitialized project, < -1 is a new subproject > -1 has been saved to databse
        if (subProjCount === undefined) {
            subProjCount = -2;
        } 
        subProj.profile.id = subProjCount;
        subProj.profile.name = activity.profile.name;
        --subProjCount;
        subProjCount$.next(subProjCount);
        this.pManager.getChannel(AppKeys.createdProject).next(subProj)
        this.swapProjWithSubProj(subProj, activity, project);
    }

    public formatDate(date) {
        if (date == null) {
            return null;
        }
        return lightFormat(date, ChartKeys.mainDateFormat);
    }
    public updateDate(date, field, activity: Activity, project: Project) {
        switch (field) {
            case 'finish':
                activity.profile.finish = this.formatDate(date);
                activity.profile.finish_dt = date;
                break;
            case 'start_date':
                activity.profile.start_date = this.formatDate(date);
                activity.profile.start_date = date;
                break;
            case 'pcd':
                activity.profile.planned_completion_date = this.formatDate(date);
                activity.profile.planned_completion_date_dt = date;
                break;
        }
        this.updateProject(project);
    }

    public setLabel(label: string, selectedNode: Integration, project: Project){
        selectedNode.label = label;
        this.updateProject(project);
    }
}
