import { ChangeDetectorRef, ElementRef, Input } from '@angular/core';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Activity, Integration, Project } from '@critical-pass/project/types';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SelectedActivityControllerService } from './selected-activity-controller/selected-activity-controller.service';

@Component({
    selector: 'cp-selected-activity',
    templateUrl: './selected-activity.component.html',
    providers: [ProjectSerializerService],
    styleUrls: ['./selected-activity.component.scss'],
})
export class SelectedActivityComponent implements OnInit, OnDestroy {
    private sub!: Subscription;
    private cActSub!: Subscription;

    public project!: Project;
    public activity: Activity | null = null;
    public duration!: number;
    public name!: string;
    public pcd!: Date;
    public finish!: Date;
    public subgraphId!: number;
    public isDummy!: boolean;
    public subGraphButtonType: any;
    public showPanel!: boolean;
    public selectedNode: Integration | null = null;
    public label!: string;
    public isNDummy!: boolean;
    public isMilestone!: boolean;

    @Input() projectPool: Project[] | null = null;
    @ViewChild('activityName', { static: true }) activityName!: ElementRef;
    constructor(private controller: SelectedActivityControllerService, private route: ActivatedRoute, private cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.controller.ngOnInit();
        this.cActSub = this.controller.drawChannel$.pipe(filter(x => !!x)).subscribe(trigger => {
            this.activityName.nativeElement.focus();
            this.activityName.nativeElement.select();
        });
        this.sub = this.controller.activeProject$.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
            this.activity = project.profile.view.selectedActivity ?? null;
            this.selectedNode = project.profile.view.selectedIntegration ?? null;
            if (this.activity) this.loadSelectedActivity(this.activity);
            this.loadSelectedNode(this.selectedNode);
            this.cd.detectChanges();
        });

        // TODO: Do we need this? It is not used in the controller.
        /*this.controller.prntUpdate$.pipe(filter(x => !!x)).subscribe(val => {
            if (val !== 0) {
                if (this.activity) this.controller.updateSelectedActivity(this.activity, this.project);
            }
        });*/
    }

    public ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.cActSub) {
            this.cActSub.unsubscribe();
        }
    }

    public loadSelectedActivity(activity: Activity) {
        if (activity === null) {
            this.showPanel = false;
            return;
        }
        this.showPanel = true;
        if (activity.profile.duration !== undefined) this.duration = activity.profile.duration;
        if (activity.profile.name !== undefined) this.name = activity.profile.name;
        if (activity.profile.planned_completion_date_dt !== null) this.pcd = activity.profile.planned_completion_date_dt;
        if (activity.profile.finish_dt !== null) this.finish = activity.profile.finish_dt;
        this.subgraphId = activity.subProject.subGraphId;
        this.isDummy = activity.chartInfo.isDummy;

        // subGrpahId -1 is unitialized, 0 is initialized but not saved, 1 and greater
        // are projects that have been saved, -2 and less denote muliple created like
        // in network analysis, but not saved
        this.subGraphButtonType = activity.subProject.subGraphId !== -1 ? 'load' : 'create';
    }

    public loadSelectedNode(node: Integration | null) {
        this.label = node?.label ?? '';
        this.isMilestone = node?.isMilestone ?? false;
    }

    public setDuration(event: any) {
        if (this.activity) {
            this.controller.setDuration(event.value, this.activity, this.project);
        }
    }

    public setName(event: any) {
        if (this.activity) {
            this.controller.setName(event.value, this.activity, this.project);
        }
    }

    public setPcd(pcd: string) {
        if (this.activity) {
            this.controller.setPcd(pcd, this.activity, this.project);
        }
    }

    public setFinish(finish: string) {
        if (this.activity) {
            this.controller.setFinish(finish, this.activity, this.project);
        }
    }

    public setSubGraphId(event: any) {
        if (this.activity) {
            this.controller.setSubGraphId(event.value, this.activity, this.project);
        }
    }

    public setIsDummy(event: any) {
        if (this.activity) {
            this.controller.setIsDummy(event.checked, this.activity, this.project);
        }
    }
    public setIsNDummy(event: any) {
        if (this.selectedNode) {
            this.controller.setIsNDummy(event.checked, this.selectedNode, this.project);
        }
    }
    public generateMilestone() {
        if (this.selectedNode) {
            this.controller.generateMilestone(this.selectedNode, this.project);
        }
    }
    public revertMilestone() {
        if (this.selectedNode) {
            this.controller.revertMilestone(this.selectedNode, this.project);
        }
    }

    public loadSubProject() {
        if (this.activity) {
            this.controller.loadSubProject(this.activity, this.project, this.projectPool);
        }
        this.activity = null;
    }

    public createSubProject() {
        if (this.activity) {
            this.controller.createSubProject(this.activity, this.project, this.projectPool);
        }
        this.activity = null;
    }

    public updateDate(date: Date, field: string) {
        if (this.activity) {
            this.controller.updateDate(date, field, this.activity, this.project);
        }
    }

    public setLabel(event: any) {
        if (this.selectedNode) {
            this.controller.setLabel(event.value, this.selectedNode, this.project);
        }
    }
}
