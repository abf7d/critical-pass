import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    Activity,
    ActivitySerializerService,
    Integration,
    IntegrationSerializerService,
    Project,
    ProjectExtractorService,
    ProjectManagerBase,
    ProjectSerializerService,
} from '@critical-pass/critical-charts';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SelectedActivityControllerService } from '../../profile/components/selected-activity/selected-activity-controller/selected-activity-controller.service';
import { ChartKeys } from '@critical-pass/critical-charts';
import { NetworkNode } from '../meta-graph-layout/meta-graph-layout.component';
import * as AppKeys from '../../../../core/constants/keys';


@Component({
    selector: 'proj-meta-bar',
    templateUrl: './meta-bar.component.html',
    styleUrls: ['./meta-bar.component.scss'],
})
export class MetaBarComponent implements OnInit, OnDestroy {
    public project: Project = null;
    private id: number;
    public start: number;
    public end: number;
    public sub: Subscription;
    public enableArranging: boolean;
    public activity: Activity;
    public subGraphButtonType: string;
    public showLoadBtn: boolean = false;
    public networkArray$: BehaviorSubject<Project[]>;
    public filteredNetworkArray$: BehaviorSubject<Project[]>;
    public projectName: string = '';
    public isLasso: boolean = false;
    public isSubProjSelected: boolean = false;

    constructor(
        private route: ActivatedRoute,
        @Inject('ProjectManagerBase') private pManager: ProjectManagerBase,
        private controller: SelectedActivityControllerService,
        private nodeSerializer: IntegrationSerializerService,
        private projectSerializer: ProjectSerializerService,
        private activitySerializer: ActivitySerializerService,
        private projectExtractor: ProjectExtractorService,
        private router: Router,
    ) {
        this.networkArray$ = pManager.getChannel(ChartKeys.networkArray);
        this.filteredNetworkArray$ = pManager.getChannel(ChartKeys.filteredNetworkArray);
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params.id;
        this.sub = this.pManager
            .getProject(this.id)
            .pipe(filter(x => !!x))
            .subscribe(project => {
                this.project = project;
                this.projectName = project.profile.name;
                this.activity = project.profile.view.selectedActivity;
                this.isLasso = project.profile.view.lassoOn;
                this.isSubProjSelected = project.profile.view.isSubProjSelected;
                this.loadSelectedActivity(this.activity);
            });
    }

    public updateProjectName(event: any) {
        this.projectName = event.target.value;
        this.project.profile.name = this.projectName;
    }

    public keyPress(event: any) {
        if (event.key === 'Enter') {
            this.updateProjectName(event);
        }
    }

    public toggleLasso(isOn: boolean) {
        this.project.profile.view.lassoOn = isOn;
        this.project.profile.view.lassoedLinks = [];
        this.project.profile.view.lassoedNodes = [];
        this.pManager.updateProject(this.id, this.project, true);
    }

    public loadSelectedActivity(activity: Activity) {
        if (activity === null) {
            this.showLoadBtn = false;
            return;
        }
        this.showLoadBtn = true;
        this.subGraphButtonType = activity.subProject.subGraphId >= 0 ? 'load' : 'create';
    }

    public extractSubProject() {
        if (this.isSubProjSelected) {
            const networkArray = this.networkArray$.getValue() ?? [];
            const filteredNetworkArray = this.filteredNetworkArray$.getValue() ?? [];
            let minSubProjId = Math.min(...networkArray.map(x => x.profile.id));
            if(minSubProjId === Infinity && !this.project.profile.id) {
              this.project.profile.id = -2;
              this.project.profile.name = "Origin Project"
              minSubProjId = -2;
            }
            if (filteredNetworkArray.length === 0) {
                filteredNetworkArray.push(this.project);
            }
            if (networkArray.length === 0) {
                networkArray.push(this.project);
            }

            const newSubProject = this.projectExtractor.extractSubProject(this.project, minSubProjId);
           
           
            if (newSubProject) {
                filteredNetworkArray.push(newSubProject);
                networkArray.push(newSubProject);
                this.networkArray$.next(networkArray);
                this.filteredNetworkArray$.next(filteredNetworkArray);
            }
            this.pManager.updateProject(this.id, this.project, true);
        }
    }

    public loadSubProject() {
        this.controller.loadSubProject(this.activity, this.project);
        this.activity = null;
    }

    public storeToSnapshot() {
        const networkArray = this.networkArray$.getValue() ?? [];
        const filteredNetworkArray = this.filteredNetworkArray$.getValue() ?? [];
        const networkContains = networkArray.find(n => n.profile.id === this.project.profile.id);
        const filterContains = filteredNetworkArray.find(n => n.profile.id === this.project.profile.id);
        if (this.project.profile.id === null || this.project.profile.id === 0) {
            this.project.profile.id = -1 * (networkArray.length + 1);
        }
        if (!networkContains) {
            networkArray.push(this.project);
            this.networkArray$.next(networkArray);
        } else {
            networkArray.splice(networkArray.indexOf(networkContains), 1);
            networkArray.push(this.project);
        }
        if (!filterContains) {
            filteredNetworkArray.push(this.project);
            this.filteredNetworkArray$.next(filteredNetworkArray);
        } else {
            filteredNetworkArray.splice(filteredNetworkArray.indexOf(filterContains), 1);
            filteredNetworkArray.push(this.project);
        }
    }
    public createSubProject() {
        this.controller.createSubProject(this.activity, this.project);
        this.activity = null;
    }

    public ngOnDestroy() {
        this.sub?.unsubscribe();
    }
    public navToProjProfile() {
      this.pManager.tempStore(this.project);
      this.router.navigateByUrl(AppKeys.importProfileRoute);
    }
    public navToScenarioPlanning() {
      this.pManager.tempStore(this.project);
      this.router.navigateByUrl(AppKeys.importScenarioRoute);
    }
}
