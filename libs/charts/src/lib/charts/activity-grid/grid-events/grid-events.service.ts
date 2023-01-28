import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { lightFormat, subBusinessDays } from 'date-fns';
import { Activity, ActivityProfile, Project } from '@critical-pass/project/types';
import { DependencyCrawlerService, MilestoneFactoryService } from '@critical-pass/shared/project-utils';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import * as CONST from '../../../constants/constants';
import { P_CONST } from '@critical-pass/project/processor';
@Injectable({
    providedIn: 'root',
})
export class GridEventsService {
    public project$!: Observable<Project>;
    public viewDummies$!: Observable<boolean>;
    private lastSearch!: string;
    private isAscending!: boolean;
    private _id!: number;

    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        private milestoneFactory: MilestoneFactoryService,
        private depCrawler: DependencyCrawlerService,
    ) {}

    set id(id: number) {
        this._id = id;
    }

    get id(): number {
        return this._id;
    }

    public init() {
        this.project$ = this.dashboard.activeProject$;
        this.viewDummies$ = this.eventService.get(CONST.VIEW_DUMMIES_IN_GRID_KEY);
    }

    public startEditDeps(activity: Activity, project: Project): void {
        const deps = activity.profile.depends_on.split(',').map(a => +a);
        this.editDepsClicked(activity, project);
        project.activities.forEach(a => {
            if (deps.indexOf(a.profile.id) > -1) {
                a.processInfo.inDependencyBucket = true;
            } else {
                a.processInfo.inDependencyBucket = false;
            }
        });
    }

    public submitEditDepsClicked(activity: Activity, project: Project): void {
        const deps = project.activities
            .filter(a => a.processInfo.inDependencyBucket)
            .map(a => a.profile.id)
            .join();
        activity.profile.depends_on = deps;
        this.dashboard.updateProject(project, false);
        this.editDepsClicked(activity, project);
    }

    public cancelEditDepsClicked(activity: Activity, project: Project): void {
        project.activities
            .filter(a => a.processInfo.inDependencyBucket)
            .forEach(a => {
                a.processInfo.inDependencyBucket = false;
            });
        this.editDepsClicked(activity, project);
    }

    public editDepsClicked(activity: Activity, project: Project): void {
        const nonActiveAct = project.activities.filter(a => a.profile.id !== activity.profile.id);
        nonActiveAct.forEach(a => {
            a.processInfo.inDependencyBucket = false;
            a.processInfo.editingDependencies = false;
            a.processInfo.showBucket = !a.processInfo.showBucket;
        });
        activity.processInfo.editingDependencies = !activity.processInfo.editingDependencies;
        activity.processInfo.inDependencyBucket = false;
        activity.processInfo.showBucket = false;
    }

    public drop(event: CdkDragDrop<string[]>, project: Project): void {
        moveItemInArray(project.activities, event.previousIndex - 7, event.currentIndex - 7);
        project.activities.forEach((a, i) => {
            a.profile.sortOrder = i;
        });
    }

    public updateDate(date: Date | null, profile: ActivityProfile, field: string, project: Project): void {
        if (!date) return;
        switch (field) {
            case 'finish':
                profile.finish = lightFormat(date, P_CONST.MAIN_DATE_FORMAT);
                profile.finish_dt = date;
                break;
            case 'start_date':
                profile.start_date = lightFormat(date, P_CONST.MAIN_DATE_FORMAT);
                profile.start_date_dt = date;
                break;
            case 'pcd':
                profile.planned_completion_date = lightFormat(date, P_CONST.MAIN_DATE_FORMAT);
                profile.planned_completion_date_dt = date;
                break;
        }
        this.dashboard.updateProject(project, true);
    }

    public updatePCD(date: Date, activity: Activity, project: Project): void {
        const formattedDate = lightFormat(date, P_CONST.MAIN_DATE_FORMAT);
        if (!formattedDate) {
            activity.profile.start_date = '';
            activity.profile.start_date_dt = null;
            return;
        }
        const pcdA = project.activities.find(a => a.profile.id === activity.profile.id);
        if (!pcdA) return;
        pcdA.profile.planned_completion_date = lightFormat(date, P_CONST.MAIN_DATE_FORMAT);
        pcdA.profile.planned_completion_date_dt = date;
        if (!!activity.profile.duration) {
            const start = subBusinessDays(pcdA.profile.planned_completion_date_dt, +activity.profile.duration - 1);
            pcdA.profile.start_date = lightFormat(date, P_CONST.MAIN_DATE_FORMAT);
            pcdA.profile.start_date_dt = new Date(start);
        }
        this.dashboard.updateProject(project, true);
    }

    public updateDuration(activity: Activity, duration: number, project: Project): void {
        activity.profile.duration = duration;
        if (activity.profile.planned_completion_date !== '') {
            const date = activity.profile.planned_completion_date;
            const dateObj = new Date(date!);
            const start = subBusinessDays(dateObj, +duration - 1);
            activity.profile.start_date = lightFormat(start, P_CONST.MAIN_DATE_FORMAT);

            activity.profile.start_date_dt = new Date(start);
        }
        this.dashboard.updateProject(project, true);
    }

    public removeActivity(activity: Activity, project: Project): void {
        if (activity.chartInfo.milestoneNodeId !== null) {
            this.milestoneFactory.removeMilestoneByActivity(activity, project);
            this.dashboard.updateProject(project, true);
            return;
        }
        const arrow = project.activities.find(a => a.profile.id === activity.profile.id);
        if (arrow == undefined) return;
        const { source, target } = arrow.chartInfo;
        if (!source || !target) return;
        const index = project.activities.indexOf(arrow);
        project.activities.splice(index, 1);
        const connToSource = project.activities.find(a => a.chartInfo.source_id === source.id || a.chartInfo.target_id === source.id);
        const connToTarget = project.activities.find(a => a.chartInfo.source_id === target.id || a.chartInfo.target_id === target.id);
        if (connToSource == null) {
            const indexS = project.integrations.indexOf(source);
            project.integrations.splice(indexS, 1);
        }

        if (connToTarget == null) {
            const indexT = project.integrations.indexOf(target);
            project.integrations.splice(indexT, 1);
        }
        this.dashboard.updateProject(project, true);
    }

    public updateProject(project: Project, processRisk: boolean): void {
        this.dashboard.updateProject(project, processRisk);
    }

    public sortBy(column: string, project: Project): void {
        const sameColClicked = column === this.lastSearch;
        if (sameColClicked) {
            this.isAscending = !this.isAscending;
        } else {
            this.isAscending = true;
        }
        switch (column) {
            case 'id':
                if (this.isAscending) {
                    project.activities.sort((a, b) => a.profile.id - b.profile.id);
                } else {
                    project.activities.sort((a, b) => b.profile.id - a.profile.id);
                }
                break;
            case 'name':
                project.activities.sort((a, b) => {
                    const nameA = a.profile.name ? a.profile.name.toUpperCase() : '';
                    const nameB = b.profile.name ? b.profile.name.toUpperCase() : '';
                    if (this.isAscending) {
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                    } else {
                        if (nameA < nameB) {
                            return 1;
                        }
                        if (nameA > nameB) {
                            return -1;
                        }
                    }
                    return 0;
                });
                break;
            case 'start':
                project.activities.sort((a, b) => {
                    const nameA = a.profile.start_date_dt ?? '';
                    const nameB = b.profile.start_date_dt ?? '';
                    if (this.isAscending) {
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                    } else {
                        if (nameA < nameB) {
                            return 1;
                        }
                        if (nameA > nameB) {
                            return -1;
                        }
                    }
                    return 0;
                });
                break;
            case 'pcd':
                project.activities.sort((a, b) => {
                    const nameA = a.profile.planned_completion_date_dt ?? '';
                    const nameB = b.profile.planned_completion_date_dt ?? '';
                    if (this.isAscending) {
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                    } else {
                        if (nameA < nameB) {
                            return 1;
                        }
                        if (nameA > nameB) {
                            return -1;
                        }
                    }
                    return 0;
                });
                const nonEmpty = project.activities.filter((a: Activity) => a.profile.planned_completion_date !== null);
                const empty = project.activities.filter((a: Activity) => a.profile.planned_completion_date === null);
                const orderedList = nonEmpty.concat(empty);
                project.activities = orderedList;
                project.activities.forEach((a: Activity, i) => {
                    a.profile.id = i + 1;
                });
                this.depCrawler.setDependencyDataFromGraph(project);
                break;
        }
        this.lastSearch = column;
        project.activities.forEach((a, i) => {
            a.profile.sortOrder = i;
        });
    }
}
