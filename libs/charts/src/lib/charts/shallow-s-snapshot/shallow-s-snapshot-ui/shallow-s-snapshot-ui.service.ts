import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as d3 from 'd3';
import { ShallowSSnapshotState, ShallowSSnapshotStateFactory } from '../shallow-s-snapshot-state/shallow-s-snapshot-state';
import { DashboardService } from '@critical-pass/shared/data-access';
import { Project } from '@critical-pass/project/models';
import { ShallowSCalcService } from '../../shallow-s/shallow-s-calc/shallow-s-calc.service';
import { ShallowSPoint, Stats } from '../../../models/shallow-s';

@Injectable()
export class ShallowSSnapshotUiService {
    private id!: number;
    public st!: ShallowSSnapshotState;
    private data!: Observable<Project>;
    private sub!: Subscription;
    private height!: number;
    private width!: number;

    constructor(/*private pManager: ProjectManagerBase,*/ private dashboard: DashboardService, private ngZone: NgZone,  private calc: ShallowSCalcService ) {}

    public init(width: number, height: number, id: number, el: any) {
        this.height = height;
        this.width = width;
        this.id = id;
        this.st = new ShallowSSnapshotStateFactory().create();
        this.st.innerHeight = height - this.st.margin.top - this.st.margin.bottom;
        this.st.innerWidth = width - this.st.margin.left - this.st.margin.right;
        this.initSvg(width, height, el);
        this.data = this.dashboard.activeProject$;
        this.sub = this.data.pipe(filter(x => !!x)).subscribe(project => {
            this.ngZone.runOutsideAngular(() => {
                this.createChart(project);
            });
        });
    }

    public renderStatic(project: Project, width: number, height: number, el: any): void {
        if (project != null) {
            this.width = +width;
            this.height = +height;
            this.st = new ShallowSSnapshotStateFactory().create();
            this.st.innerHeight = height - this.st.margin.top - this.st.margin.bottom;
            this.st.innerWidth = width - this.st.margin.left - this.st.margin.right;
            this.initSvg(width, height, el);
            this.createChart(project);
        }
    }

    public destroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    public initSvg(width: number, height: number, el: any): void {
        const st = this.st;
        const svgclass = 'shallow-s-snapshot' + this.id;
        d3.select(el).select('svg').remove();

        st.svg = d3.select(el).append('svg').attr('class', svgclass); 
        st.svg
            .style('width', '100%')
            .style('height', null)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${width} ${height}`);
        st.mainG = st.svg.append('g').attr('transform', 'translate(' + this.st.margin.left + ',' + this.st.margin.top + ')');
    }

    public createChart(proj: Project): void {
        const isEmpty = proj.integrations.length === 0;
        this.st.mainG.selectAll('*').remove();
        this.st.svg.select('g.empty-msg').remove();
        if (isEmpty) {
            let message = 'No data exists for Shallow S Diagram';
            this.st.svg.attr('transform', null);
            this.st.svg
                .append('g')
                .attr('class', 'empty-msg')
                .append('text')
                .attr('class', 'missing-data')
                .attr('y', this.height / 3)
                .attr('x', this.width / 2 + 100)
                .style('text-anchor', 'end')
                .text(message);
            return;
        }
        const dataset = this.getDataset(proj);
        const props = this.calc.calculateShallowSSnapshotProps(dataset, proj);
        if (!props) {
            return;
        }
        this.drawChart(props);
    }

    private drawChart(props: Stats): void {
        const xScale = d3.scaleTime().range([0, this.st.innerWidth]).domain(props.extents.x);
        const yScale = d3.scaleLinear().range([this.st.innerHeight, 0]).domain(props.extents.y);
        this.drawAxes(xScale, yScale);
        this.drawLines(props, xScale, yScale);
    }

    private getDataset(proj: Project): ShallowSPoint[] {
        return proj.activities
            .filter(a => !a.chartInfo.isDummy)
            .map(a => {
                return {
                    id: a.profile.id,
                    actual: a.profile.finish_dt,
                    planned: a.profile.planned_completion_date_dt,
                    name: a.profile.name,
                    duration: a.profile.duration,
                    percentActualFinished: null,
                    percentPlannedFinished: null,
                    isMilestone: !!a.chartInfo.milestoneNodeId,
                } as ShallowSPoint;
            });
    }

    private drawAxes(xScale: any, yScale: any): void {
        const formatDate = d3.timeFormat('%-m/%-d/%-Y');

        // formatDate is cast as any is it working here?
        const xAxis = d3.axisBottom(xScale).tickFormat(formatDate as any).ticks(4);
        const yAxis = d3.axisLeft(yScale).ticks(5);
        this.st.mainG
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.st.innerHeight + ')')
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-25)');

        this.st.mainG
            .append('g')
            .attr('class', 'y axis axisLeft')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('% Completion');
    }

    private drawLines(props: Stats, xScale: any, yScale: any): void {
        var plannedLine = d3
            .line<ShallowSPoint>()
            .x(d => xScale(d.planned))
            .y(d => yScale(d.percentPlannedFinished))
            .curve(d3.curveLinear);
        var actualLine = d3
            .line<ShallowSPoint>()
            .x(d => xScale(d.actual))
            .y(d => yScale(d.percentActualFinished))
            .curve(d3.curveLinear);

        const plannedSorted = props.data.filter(x => !!x.planned).sort((a, b) => this.getSortComparator(a.planned, b.planned));
        const actualSorted = props.data.filter(x => !!x.actual).sort((a, b) => this. getSortComparator(a.actual, b.actual));
        this.st.mainG.append('path').datum(plannedSorted).attr('clip-path', 'url(#clip)').attr('class', 'line planned').attr('d', plannedLine);
        this.st.mainG.append('path').datum(actualSorted).attr('clip-path', 'url(#clip)').attr('class', 'line actual').attr('d', actualLine);
    }

    private getSortComparator(a?: Date, b?: Date): number {
        if (!a && !b) {
            return 0;
        }
        if (!a) {
            return 1;
        }
        if (!b) {
            return -1;
        }
        return a.getTime() - b.getTime();
    }
}
