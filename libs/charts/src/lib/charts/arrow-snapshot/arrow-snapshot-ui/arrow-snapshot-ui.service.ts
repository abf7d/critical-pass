import { Inject, Injectable, NgZone } from '@angular/core';
import { Activity, Integration, Project } from '@critical-pass/project/types';
import { Observable, Subscription } from 'rxjs';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import * as CONST from '../../../constants/constants';
import * as d3 from 'd3';

@Injectable()
export class ArrowSnapshotUiService {
    private id!: number | string;
    private svg: any;
    private width!: number;
    private height!: number;
    private data!: Observable<Project> | Observable<Project | null>;
    private sub!: Subscription;
    private slot!: string | undefined;
    private parentId!: string;

    constructor(@Inject(DASHBOARD_TOKEN) private dashboard: DashboardService, private ngZone: NgZone) {}

    public init(width: number, height: number, id: number, parentId: string, el: any, slot: string | undefined) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.slot = slot;
        this.initSvg(width, height, el);
        if (!slot || slot !== CONST.SECONDARY_SLOT) {
            this.data = this.dashboard.activeProject$;
        } else {
            this.data = this.dashboard.secondaryProject$;
        }
        this.sub = this.data.subscribe(project => {
            this.ngZone.runOutsideAngular(() => {
                this.createChart(project);
            });
        });
    }

    public renderStatic(project: Project, width: number, height: number, el: any, autozoom: boolean = true): void {
        if (project != null) {
            this.width = +width;
            this.height = +height;
            project.profile.view.autoZoom = autozoom;
            project.profile.view.toggleZoom = autozoom;
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
        const svgclass = `arrow-snapshot-${this.id}`;
        d3.select(el).select('svg').remove();
        const baseSvg = d3.select(el).append('svg').attr('class', svgclass);
        baseSvg.style('width', '100%').style('height', null).attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', `0 0 ${width} ${height}`);
        this.svg = baseSvg.append('g');
    }

    private createChart(project: Project | null): void {
        this.svg.selectAll('g.link').remove();
        this.svg.selectAll('g.node').remove();
        this.svg.selectAll('text.missing-data').remove();

        if (project == null || (project.activities.length === 0 && project.integrations.length === 0)) {
            let message = 'No data exists for Arrow Diagram';
            if (this.slot === CONST.SECONDARY_SLOT) {
                message = 'No parent exists for this project';
            }
            this.svg.attr('transform', null);
            this.svg
                .append('g')
                .append('text')
                .attr('class', 'missing-data')
                .attr('y', this.height / 3)
                .attr('x', this.width / 2 + 100)
                .style('text-anchor', 'end')
                .text(message);
            return;
        }
        if (project != null) {
            this.autoZoom(project);

            let links = this.svg.append('g').attr('class', 'link').selectAll('g');
            let nodes = this.svg.append('g').attr('class', 'node').selectAll('g');

            const nonMilestone = project.activities.filter(x => !x.chartInfo.milestoneNodeId);
            links = links
                .data(nonMilestone, (d: Activity) => d.profile.id)
                .enter()
                .append('g')
                .attr('class', (d: Activity) => {
                    if (d.chartInfo.tf === null || d.chartInfo.tf === Infinity) {
                        if (d.chartInfo.isDummy) {
                            return 'unprocessed dummy';
                        }
                        return 'unprocessed';
                    }
                    return d.chartInfo.isDummy ? 'dummy risk-' + d.chartInfo.risk : 'risk-' + d.chartInfo.risk;
                });

            links
                .append('svg:path')
                .attr('class', 'link')
                .classed('dummy', (d: Activity) => {
                    return d.chartInfo.isDummy;
                })

                .style('marker-end', (d: Activity) => {
                    if (d.chartInfo.tf === null || d.chartInfo.tf === Infinity) {
                        return 'url(#s-end-u)';
                    }
                    return 'url(#s-end-' + d.chartInfo.risk + ')';
                })
                .attr('d', (d: Activity) => this.getPath(d));

            nodes = nodes
                .data(project.integrations)
                .enter()
                .append('g')
                .attr('class', (d: Integration) => {
                    if (d.lft === null || d.lft === Infinity) {
                        return 'unprocessed ';
                    }
                    return 'risk-' + d.risk;
                })
                .classed('milestone', (m: Integration) => m.isMilestone)
                .attr('transform', (d: Integration) => `translate(${d.x}, ${d.y})`);

            nodes
                .append('circle')
                .attr('r', 9)
                .attr('class', 'node')
                .classed('dummy', (d: Integration) => d.isDummy);

            const arrowHead = this.svg.append('svg:defs').selectAll('marker');

            this.buildArrowHeads(arrowHead, 's-end-0', 'risk-0');
            this.buildArrowHeads(arrowHead, 's-end-1', 'risk-1');
            this.buildArrowHeads(arrowHead, 's-end-2', 'risk-2');
            this.buildArrowHeads(arrowHead, 's-end-3', 'risk-3');
            this.buildArrowHeads(arrowHead, 's-end-undefined', 'risk-undefined');
            this.buildArrowHeads(arrowHead, 's-end-u', 'unprocessed');
        }
    }
    private getPath(d: Activity): string {
        if (
            d.chartInfo?.target?.x === undefined ||
            d.chartInfo?.target?.y === undefined ||
            d.chartInfo?.source?.x === undefined ||
            d.chartInfo?.source?.y === undefined
        ) {
            console.error('getPath point undefined');
            return 'M';
        }
        if(d.chartInfo?.target?.x == d.chartInfo?.source?.x &&
            d.chartInfo?.target?.y == d.chartInfo?.source?.y) {
                d.chartInfo.target.x += 10;
                d.chartInfo.target.y += 10;
            }
        const deltaX = d.chartInfo.target.x - d.chartInfo.source.x,
            deltaY = d.chartInfo.target.y - d.chartInfo.source.y,
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = 9,
            targetPadding = 14,
            sourceX = d.chartInfo.source.x + sourcePadding * normX,
            sourceY = d.chartInfo.source.y + sourcePadding * normY,
            targetX = d.chartInfo.target.x - targetPadding * normX,
            targetY = d.chartInfo.target.y - targetPadding * normY;
        
        if (isNaN(sourceX) || isNaN(sourceY) || isNaN(targetX) || isNaN(targetY)) {
            console.error('getPath point NaN', d);
            return 'M';
        }

        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    }

    private autoZoom(project: Project): void {
        const xPos = project.integrations.map(i => i.x).filter(i => i !== undefined) as number[];
        const yPos = project.integrations.map(i => i.y).filter(i => i !== undefined) as number[];
        const maxX = Math.max(...xPos);
        const minX = Math.min(...xPos);
        const maxY = Math.max(...yPos);
        const minY = Math.min(...yPos);

        const marginX = 0;
        const marginY = 0;

        const dx = maxX - minX,
            dy = maxY - minY,
            x = (maxX + minX) / 2,
            y = (maxY + minY) / 2,
            scale = 0.9 / Math.max(dx / this.width, dy / this.height),
            translate = [this.width / 2 - scale * x - marginX, this.height / 2 - scale * y - marginY];

        if (isNaN(scale) || isNaN(translate[0]) || isNaN(translate[1])) {
            return;
        }

        if (translate[0] === -Infinity || translate[1] === -Infinity || scale === Infinity) {
            return;
        }

        this.svg.attr('transform', 'translate(' + translate + ')scale(' + scale + ')');
    }
    private buildArrowHeads(svg: any, id: string, risk: string): void {
        svg = svg
            .data([id])
            .enter()
            .append('svg:marker')
            .attr('id', String)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 6)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
            .attr('class', risk)
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');
    }
}
