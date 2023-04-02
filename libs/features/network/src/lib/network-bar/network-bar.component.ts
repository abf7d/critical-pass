import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN, ProjectStorageApiService, API_CONST } from '@critical-pass/shared/data-access';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ProjectExtractorService } from '../project-extractor/project-extractor.service';
import { Activity, Project } from '@critical-pass/project/types';
import { CORE_CONST } from '@critical-pass/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'proj-meta-bar',
    templateUrl: './network-bar.component.html',
    styleUrls: ['./network-bar.component.scss'],
})
export class NetworkBarComponent implements OnInit, OnDestroy {
    public project: Project | null = null;

    public sub!: Subscription;
    public activity: Activity | null = null;
    public showLoadBtn: boolean = false;
    public networkArray$: BehaviorSubject<Project[]>;
    public filteredNetworkArray$: BehaviorSubject<Project[]>;
    public projectName: string = '';
    public isLasso: boolean = false;
    public isSubProjSelected: boolean = false;

    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        private projectExtractor: ProjectExtractorService,
        private router: Router,
        private storageApi: ProjectStorageApiService,
        private toastr: ToastrService,
    ) {
        this.networkArray$ = this.eventService.get<Project[]>(CORE_CONST.NETWORK_ARRAY_KEY);
        this.filteredNetworkArray$ = this.eventService.get<Project[]>(CORE_CONST.FILTERED_NETWORK_ARRAY_KEY);
    }

    ngOnInit(): void {
        this.sub = this.dashboard.activeProject$.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
            this.projectName = project.profile.name;
            this.activity = project.profile.view.selectedActivity;
            this.isLasso = project.profile.view.lassoOn;
            this.isSubProjSelected = project.profile.view.isSubProjSelected;
        });
    }

    public updateProjectName(event: any) {
        this.projectName = event.target.value;
        if (this.project) {
            this.project.profile.name = this.projectName;
        }
    }

    public keyPress(event: any) {
        if (event.key === 'Enter') {
            this.updateProjectName(event);
        }
    }

    public toggleLasso(isOn: boolean) {
        if (this.project) {
            this.project.profile.view.lassoOn = isOn;
            this.project.profile.view.lassoedLinks = [];
            this.project.profile.view.lassoedNodes = [];
            this.dashboard.updateProject(this.project, true);
        }
    }

    public extractSubProject() {
        if (this.isSubProjSelected && this.project) {
            const networkArray = this.networkArray$.getValue() ?? [];
            const filteredNetworkArray = this.filteredNetworkArray$.getValue() ?? [];
            let minSubProjId = Math.min(...networkArray.map(x => x.profile.id));
            if (minSubProjId === Infinity && !this.project.profile.id) {
                this.project.profile.id = -2;
                this.project.profile.name = 'Origin Project';
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
            this.dashboard.updateProject(this.project, true);
        }
    }

    public storeToSnapshot() {
        if (this.project !== null) {
            const networkArray = this.networkArray$.getValue() ?? [];
            const filteredNetworkArray = this.filteredNetworkArray$.getValue() ?? [];
            const networkContains = networkArray.find(n => n.profile.id === this.project!.profile.id);
            const filterContains = filteredNetworkArray.find(n => n.profile.id === this.project!.profile.id);
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
    }

    public ngOnDestroy() {
        this.sub?.unsubscribe();
    }
    public navToProjProfile() {
        this.storageApi.set(API_CONST.SESSION_STORAGE, this.project!);
        this.router.navigateByUrl(CORE_CONST.IMPORT_PROFILE_ROUTE);
    }
    public navToScenarioPlanning() {
        this.storageApi.set(API_CONST.SESSION_STORAGE, this.project!);
        this.router.navigateByUrl(CORE_CONST.IMPORT_SCENARIO_ROUTE);
    }
    public stash() {
        try {
            this.storageApi.set(API_CONST.LOCAL_STORAGE, this.project!);
        } catch (ex) {
            this.toastr.error('Stash Chart', 'Error occured.');
            console.error(ex);
            return;
        }
        this.toastr.success('Stash Chart', 'Success!');
    }
}
