import { Inject, Injectable, NgZone } from '@angular/core';
import * as d3 from 'd3';
import * as CONST from '../../../constants/constants';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LassoToolService } from './lasso-tool/lasso-tool.service';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { NodeArrangerService } from '@critical-pass/shared/project-utils';
import { Project } from '@critical-pass/project/types';
import { ChartElFactory } from './chart-el-factory/chart-el-factory.service';
import { ArrowSvgZoomService } from './arrow-svg-zoom/arrow-svg-zoom.service';
import { EventBinderService } from './event-binder/event-binder.service';
import { ArrowStateService } from '../arrow-state/arrow-state';
import { ArrowControllerService } from '../arrow-controller/arrow-controller.service';
@Injectable({
    providedIn: 'root',
})
export class ArrowChartUIService {
    private id!: number;
    private data!: Observable<Project>;
    private sub!: Subscription;
    public projIsEmpty: BehaviorSubject<boolean>;
    private proj!: Project;
    private rebuild!: boolean;

    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        private ngZone: NgZone,
        private lassoTool: LassoToolService,
        private controller: ArrowControllerService,
        private nodeArranger: NodeArrangerService,
        private events: EventBinderService,
        private elements: ChartElFactory,
        private svgZoom: ArrowSvgZoomService,
        private st: ArrowStateService,
    ) {
        this.projIsEmpty = new BehaviorSubject(true);
    }

    public init(width: number, height: number, id: number, rebuild: boolean, el: any) {
        this.id = id;
        this.st.width = width;
        this.st.height = height;
        this.rebuild = rebuild;
        this.initSvg(width, height, el);
        this.events.bindGlobalEvents();
        this.data = this.dashboard.activeProject$;

        this.sub = this.data.pipe(filter(x => !!x)).subscribe(project => {
            this.ngZone.runOutsideAngular(() => {
                this.createChart(project);
            });
        });
        this.st.activity_created = this.eventService.get(CONST.ACTIVITY_CREATED_KEY);
    }

    public destroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    public createFastActivity(event: any, mode: string, autoArrange: boolean = false) {
        const newActivity = this.controller.addFastActivity(event, this.proj, mode, this.st.last_selected_node!);
        if (newActivity) {
            if (mode === CONST.SUB_ARROW_CREATION_MODE) {
                this.st.last_selected_node = newActivity.chartInfo.target ?? null;
            }
            if (autoArrange === true) {
                this.nodeArranger.arrangeNodes(this.proj);
            }
            this.dashboard.updateProject(this.proj, true);
        }
    }

    public deselectItem() {
        this.st.allowDeletes = false;
        const needsUpdate = this.controller.checkDeselect(this.proj);
        if (needsUpdate) {
            this.controller.deselectActivity(this.proj);
            this.controller.deselectNode(this.proj);
            this.dashboard.updateProject(this.proj, false);
        }
    }

    public disableDeletes() {
        this.st.allowDeletes = false;
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @param  {any} el
     * @returns void
     */
    public initSvg(width: number, height: number, el: any): void {
        const st = this.st;
        const svgclass = 'big-arrow-' + this.id;
        // use this fullRefresh to remove the everything and rebuild the svg
        if (this.rebuild) {
            d3.select(el).select('svg').remove();
        }
        if (!this.st.svg || this.rebuild) {
            const svg = d3.select(el).append('svg').attr('class', svgclass);
            this.st.svg = svg
                .style('width', '100%')
                .style('height', null)
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', `0 0 ${width} ${height}`);

            st.mainG = st.svg.append('g');
            st.mainG.classed('main-arrow', true);
            st.drag_line = st.mainG.append('svg:path').attr('class', 'link dragline hidden').attr('d', 'M0,0L0,0');
        }
    }

    public createChart(project: Project): void {
        this.proj = project;
        const isEmpty = project.integrations.length === 0;
        this.projIsEmpty.next(isEmpty);
        if (this.rebuild) {
            this.elements.clearElements();
        }
        if (isEmpty) {
            return;
        }
        this.svgZoom.zoom(project);
        this.elements.createArrowHeads();
        this.elements.createNodes(project);
        this.elements.createArrows(project);
        this.buildDict(project);
        this.lassoTool.buildLasso(project);
        this.st.prevProjId = project.profile.id;
    }

    private buildDict(project: Project): void {
        this.st.arrowRisk = new Map<number, number>();
        project.activities.forEach((a, i) => this.st.arrowRisk.set(a.profile.id, a.chartInfo.risk));
        this.st.nodeRisk = new Map<number, number>();
        project.integrations.forEach((n, i) => this.st.nodeRisk.set(n.id, n.risk));
    }
}
