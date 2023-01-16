import { Inject, Injectable, NgZone } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import * as d3 from 'd3';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StackedResourcesSchedulerService } from '../stacked-resources-scheduler/stacked-resources-scheduler.service';
import { Margin, StackedResourcesState, StackedResourcesStateFactory } from '../stacked-resources-state/stacked-resources-state';

@Injectable({
    providedIn: 'root',
})
export class StackedResourcesUiService {
    private id!: number;
    public st!: StackedResourcesState;
    private data!: Observable<Project>;
    private sub!: Subscription;
    private projIsEmpty!: BehaviorSubject<boolean>;

    constructor(@Inject(DASHBOARD_TOKEN) private dashboard: DashboardService, private ngZone: NgZone, private scheduler: StackedResourcesSchedulerService) {}

    public init(width: number, height: number, margin: Margin, showAxes: boolean, id: number, barWidth: number, el: any) {
        this.id = id;
        this.st = new StackedResourcesStateFactory().create();
        this.st.margin = margin;
        this.st.innerHeight = height - this.st.margin.top - this.st.margin.bottom;
        this.st.innerWidth = width - this.st.margin.left - this.st.margin.right;
        this.st.showAxes = showAxes;
        this.st.barWidth = barWidth;
        this.st.el = el;
        this.initSvg(width, height, el);
        this.data = this.dashboard.activeProject$;
        this.sub = this.data.pipe(filter(x => !!x)).subscribe(project => {
            this.ngZone.runOutsideAngular(() => {
                this.createChart(project);
            });
        });
    }

    public renderStatic(width: number, height: number, margin: Margin, showAxes: boolean, project: Project, barWidth: number, el: any) {
        this.st = new StackedResourcesStateFactory().create();
        this.st.margin = margin;
        this.st.innerHeight = height - this.st.margin.top - this.st.margin.bottom;
        this.st.innerWidth = width - this.st.margin.left - this.st.margin.right;
        this.st.showAxes = showAxes;
        this.st.barWidth = barWidth;
        this.st.el = el;
        this.initSvg(width, height, el);
        this.createChart(project);
    }

    public destroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    public setProjIsEmpty(isEmpty: BehaviorSubject<boolean>): void {
        this.projIsEmpty = isEmpty;
    }

    private initSvg(width: number, height: number, el: any): void {
        const svgclass = 'stacked-resources-' + this.id;
        d3.select(el).select('svg').remove();
        const svg = d3.select(el).append('svg').attr('class', svgclass);
        this.st.svg = svg
            .style('width', '100%')
            .style('height', null)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .append('g');

        this.st.mainG = this.st.svg.append('g').attr('transform', `translate(${this.st.margin.left},${this.st.margin.top})`);
    }

    private createChart(project: Project): void {
        const isEmpty = project.integrations.length === 0;
        this.projIsEmpty.next(isEmpty);
        if (isEmpty) {
            this.drawChart(null);
            return;
        }
        this.st.mainG.remove();
        this.st.mainG = this.st.svg.append('g').attr('transform', `translate(${this.st.margin.left},${this.st.margin.top})`);

        const stackedData = this.scheduler.getStackedResourceData(project, this.st);
        this.drawChart(stackedData);
    }

    private drawChart(stackedData: any): void {
        if (stackedData === null) {
            this.st.mainG
                .append('g')
                .attr('width', this.st.innerWidth! + this.st.margin.left + this.st.margin.right)
                .attr('height', this.st.innerHeight! + this.st.margin.top + this.st.margin.bottom)
                .append('g')
                .append('text')
                .attr('class', 'missing-data')
                .attr('y', (this.st.innerHeight! + this.st.margin.top + this.st.margin.bottom) / 3 + 10)
                .attr('x', (this.st.innerWidth! + this.st.margin.left + this.st.margin.right) / 2 + 100)
                .style('text-anchor', 'end')
                .text('No data exists for Stacked Resources');
            return;
        }
        const keys: string[] = [];
        for (const key in stackedData[0]) {
            if (key !== 'endDate' && key !== 'midDate' && key !== 'startDate') {
                keys.push(key);
            }
        }

        const x = d3.scaleBand().rangeRound([0, this.st.innerWidth!]);
        const y = d3.scaleLinear().rangeRound([this.st.innerHeight!, 0]);
        const z = d3.scaleOrdinal(d3.schemeCategory10);
        const xAxis = d3
            .axisBottom(x)
            .scale(x)
            .tickFormat(d3.timeFormat('%m-%d-%Y') as any);

        const yAxis = d3.axisRight(y).scale(y);
        const layers = d3.stack().keys(keys)(stackedData);

        x.domain(layers[0].map(d => d.data['midDate']) as unknown as string[]);
        y.domain([0, d3.max(layers[layers.length - 1], (d: any) => d[1])]).nice();

        let indices = [];

        const layer = this.st.mainG
            .selectAll('layer')
            .data(layers)
            .enter()
            .append('g')
            .attr('class', 'layer')
            .style('fill', (d: any, i: any) => {
                indices.push(i);
                return z(i.toString());
            })
            .attr('pos', (d: any, i: any) => keys[i].toString())
            .attr('index', (d: any, i: any) => i.toString());
        layer
            .selectAll('rect')
            .data((d: any) => d)
            .enter()
            .append('rect')
            .attr('x', (d: any) => x(d.data.midDate.toString()))
            .attr('y', (d: any) => y(d[1]))
            .attr('bottom', (d: any) => d[0])
            .attr('top', (d: any) => d[1])
            .attr('height', (d: any) => {
                if (d[1] - d[0] == 2) {
                    let b = 5;
                }
                return y(d[0]) - y(d[1]);
            })
            .attr('width', x.bandwidth() - 1);
        layer.selectAll('rect').call(d3.drag().on('drag', sourceObj => {}));
        if (this.st.showAxes) {
            this.st.mainG
                .append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', `translate(0,${this.st.innerHeight})`)
                .call(xAxis)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '.15em')
                .attr('transform', 'rotate(-65)');

            this.st.mainG.append('g').attr('class', 'axis axis--y').attr('transform', `translate(${this.st.innerWidth},0)`).call(yAxis);
        }
    }
}
