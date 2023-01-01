import { ChangeDetectorRef, Input } from '@angular/core';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Activity } from '@critical-pass/critical-charts';
import { Integration } from '@critical-pass/critical-charts';
import { Project } from '@critical-pass/critical-charts';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SelectedActivityControllerService } from './selected-activity-controller/selected-activity-controller.service';

@Component({
    selector: 'cp-selected-activity',
    templateUrl: './selected-activity.component.html',
    styleUrls: ['./selected-activity.component.scss'],
})
export class SelectedActivityComponent implements OnInit, OnDestroy {
    private id: number;
    private sub: Subscription;
    private cActSub: Subscription;

    public project: Project;
    public activity: Activity;
    public duration: number;
    public name: string;
    public pcd: Date;
    public finish: Date;
    public subgraphId: number;
    public isDummy: boolean;
    public subGraphButtonType: any;
    public showPanel: boolean;
    public selectedNode: Integration;
    public label: string;
    public isNDummy: boolean;
    public isMilestone: boolean;

    @Input() projectPool: Project[] = null;
    @ViewChild('activityName', { static: true }) activityName;
    constructor(private controller: SelectedActivityControllerService, private route: ActivatedRoute, private cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.id = this.route.snapshot.params.id;
        if (this.id == null) {
            return;
        }
        this.controller.ngOnInit(this.id);
        this.cActSub = this.controller.drawChannel$.pipe(filter(x => !!x)).subscribe(trigger => {
            this.activityName.nativeElement.focus();
            this.activityName.nativeElement.select();
        });
        this.sub = this.controller.data$.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
            this.activity = project.profile.view.selectedActivity;
            this.selectedNode = project.profile.view.selectedIntegration;
            this.loadSelectedActivity(this.activity);
            this.loadSelectedNode(this.selectedNode);
            this.cd.detectChanges();
        });

        this.controller.prntUpdate$.pipe(filter(x => !!x)).subscribe(val => {
            if (val !== 0) {
                this.controller.updateSelectedActivity(this.activity, this.project);
            }
        });
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
        this.duration = activity.profile.duration;
        this.name = activity.profile.name;
        this.pcd = activity.profile.planned_completion_date_dt;
        this.finish = activity.profile.finish_dt;
        this.subgraphId = activity.subProject.subGraphId;
        this.isDummy = activity.chartInfo.isDummy;

        // subGrpahId -1 is unitialized, 0 is initialized but not saved, 1 and greater 
        // are projects that have been saved, -2 and less denote muliple created like 
        // in network analysis, but not saved
        this.subGraphButtonType = activity.subProject.subGraphId !== -1 ? 'load' : 'create';
    }

    public loadSelectedNode(node: Integration) {
        this.label = node?.label;
        this.isMilestone = node?.isMilestone;
    }

    public setDuration(duration: string) {
        this.controller.setDuration(duration, this.activity, this.project);
    }

    public setName(name: string) {
        this.controller.setName(name, this.activity, this.project);
    }

    public setPcd(pcd: string) {
        this.controller.setPcd(pcd, this.activity, this.project);
    }

    public setFinish(finish: string) {
        this.controller.setFinish(finish, this.activity, this.project);
    }

    public setSubGraphId(id: string) {
        this.controller.setSubGraphId(id, this.activity, this.project);
    }

    public setIsDummy(isDummy: boolean) {
        this.controller.setIsDummy(isDummy, this.activity, this.project);
    }
    public setIsNDummy(isDummy: boolean) {
        this.controller.setIsNDummy(isDummy, this.selectedNode, this.project);
    }
    public generateMilestone() {
        this.controller.generateMilestone(this.selectedNode, this.project);
    }
    public revertMilestone() {
        this.controller.revertMilestone(this.selectedNode, this.project);
    }

    public loadSubProject() {
        this.controller.loadSubProject(this.activity, this.project, this.projectPool);
        this.activity = null;
    }

    public createSubProject() {
        this.controller.createSubProject(this.activity, this.project, this.projectPool);
        this.activity = null;
    }

    public updateDate(date, field) {
        this.controller.updateDate(date, field, this.activity, this.project);
    }

    public setLabel(label: string) {
        this.controller.setLabel(label, this.selectedNode, this.project);
    }
}
