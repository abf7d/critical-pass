import { Inject, Injectable } from '@angular/core';
import { Activity, Integration, Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import * as d3 from 'd3';
import { SvgTranform } from '../../../models/svg-transform';
import { ArrowState } from '../arrow-state/arrow-state';
import { Key } from 'ts-keycode-enum';
import { ThisReceiver } from '@angular/compiler';
import { ArrowControllerService } from '../utils/arrow-controller.service';

@Injectable({
    providedIn: 'root',
})
export class LassoToolService {
    private lassoG: any;
    private mainG: any;
    private targetArea: any;
    private drawnCoords!: [number, number][];
    private dynPath: any;
    private closePath: any;
    private tpath!: string;
    private origin!: [number, number];
    private torigin!: [number, number];
    private originNode: any;
    private project!: Project;
    private transform: SvgTranform = { k: 1, x: 0, y: 0 };
    private st!: ArrowState;
    private selectedNodes!: number[];
    private selectedActivities!: number[];
    private lassoStart: number | null = null;
    private lassoEnd: number | null = null;
    private id!: number;

    constructor(@Inject(DASHBOARD_TOKEN) private dashboard: DashboardService, private arrowController: ArrowControllerService) {}

    public setTransform(transform: SvgTranform) {
        this.transform = transform;
    }
    public init(st: ArrowState, project: Project, id: number) {
        this.id = id;
        this.st = st;
        st.svg.selectAll('.lasso').remove();
        this.mainG = st.svg;
        this.lassoG = st.svg.append('g');
        this.lassoG.classed('lasso', true);
        this.targetArea = this.lassoG.append('rect');
        this.selectedNodes = project.profile.view.lassoedNodes;
        this.selectedActivities = project.profile.view.lassoedLinks;
        this.targetArea.attr('width', '100%').attr('height', '100%').style('fill', 'red').style('opacity', 0.1);
        this.project = project;
        this.dynPath = this.lassoG.append('path').attr('class', 'drawn');
        this.closePath = this.lassoG.append('path').attr('class', 'loop_close');
        this.originNode = this.lassoG.append('circle').attr('class', 'origin');
        this.drawnCoords = [];
        this.tpath = '';
        const dragEvent = d3
            .drag()
            .filter(event => !event.button)
            .on('start', () => this.dragstart)
            .on('drag', event => this.dragmove(event))
            .on('end', () => this.dragend());
        this.targetArea.call(dragEvent);

        this.st.nodes.classed('possible', (d: Integration) => this.selectedNodes.indexOf(d.id) > -1);
        this.st.links.classed('possible', (d: Activity) => this.selectedActivities.indexOf(d.profile.id) > -1);
        this.initForces(project);
    }

    private nodes: any;
    private links: any;
    private nmap = new Map<number, Integration>();
    private initForces(project: Project) {
        // Construct the forces.

        const nmap = new Map<number, Integration>(project.integrations.map(x => [x.id,x])); //d3.map(nodes, nodeId).map(intern);
        //project.activities.map(x => x.chartInfo)
        this.nodes = d3.map(project.integrations, (_, i) => ({ id: _.id }));
        this.nmap = new Map<number, any>(this.nodes.map((x: any) => [x.id, x]));
        this.links = d3.map(
            project.activities.map(x => x),
            (_, i) => ({ source: this.nmap.get(_.chartInfo.source!.id), target: this.nmap.get(_.chartInfo.target!.id), id: _.profile.id }),
        ); 

        const nodeStrength = 100;
        const linkStrength = 1;
        const forceNode = d3.forceManyBody().strength(-200);

        // @ts-ignore
        const forceLink = d3.forceLink(this.links).id(d => d.id);
        // if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
        // if (linkStrength !== undefined) forceLink.strength(linkStrength);
        const _this = this;
        // @ts-ignore
        const simulation = d3.forceSimulation(this.nodes)
            .force('link', forceLink)
            .force('charge', forceNode)
            .force('center', d3.forceCenter())
            .on('tick', function() {
                _this.ticked(this, _this.st)
            });
        // this.st.nodes.call(simulation);
    }
    tickThreshold = 1000;
    tickCount = 0;
    private ticked(simulation: any, st: any) {
        if(this.tickCount > this.tickThreshold) {
            return;
        }
        this.tickCount += 1;
        st.links.select('path')
            .attr('d', (d: Activity) => this.getPath(this.nmap.get(d.chartInfo.source!.id)!.x!, this.nmap.get(d.chartInfo.source!.id)!.y!, this.nmap.get(d.chartInfo.target!.id)!.x!, this.nmap.get(d.chartInfo.target!.id)!.y!));

            st.nodes.attr('cx', (d: Integration) => this.nmap.get(d.id)!.x).attr('transform', (d: Integration) => `translate(${this.nmap.get(d.id)!.x},${this.nmap.get(d.id)!.y})` );
    }

    public getPath(sx:number, sy: number, tx: number, ty: number): string {
        const deltaX = tx - sx;
        const deltaY =ty - sy;
        const distr = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normX = deltaX / distr;
        const normY = deltaY / distr;
        const sourcePadding = 12;
        const targetPadding = 17;
        const sourceX = sx + sourcePadding * normX;
        const sourceY = sy + sourcePadding * normY;
        const targetX = tx - targetPadding * normX;
        const targetY = ty - targetPadding * normY;
        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    }

    public keydown(event: any) {
        if (event.keyCode === Key.Ctrl) {
            if (this.project.profile.view.lassoOn === true) {
                this.previousPos = null;
                const dragEvent = d3
                    .drag()
                    .filter(event => !event.button)
                    .on('start', this.nodeMoveDragStart)
                    .on('drag', event => this.nodeMoveDragMove(event))
                    .on('end', this.nodeMoveDragEnd);
                this.targetArea.call(dragEvent);
            }
        }
    }
    public keyup(event: any) {
        if (event.keyCode === Key.Ctrl) {
            if (this.project.profile.view.lassoOn === true) {
                this.init(this.st, this.project, this.id);
            }
        }
    }

    private previousPos: [number, number] | null = null;
    public nodeMoveDragStart() {}
    public nodeMoveDragMove(event: any) {
        const pt = d3.pointer(event, this.mainG.node());
        const [x, y] = this.unTransformPt(pt);
        if (this.previousPos) {
            const [px, py] = this.previousPos;
            const dx = x - px;
            const dy = y - py;
            this.st.nodes.attr('transform', (d: Integration) => {
                if (this.selectedNodes.indexOf(d.id) > -1) {
                    d.x = d.x! + dx;
                    d.y = d.y! + dy;
                    return `translate(${d.x!}, ${d.y!})`;
                }
                return `translate(${d.x}, ${d.y})`;
            });
            this.arrowController.updateGroupPosition(this.project, this.selectedNodes);
        }
        this.previousPos = [x, y];
    }

    public nodeMoveDragEnd() {
        this.previousPos = null;
    }

    public remove(st: ArrowState, id: number) {
        this.id = id;
        st.svg.selectAll('.lasso').remove();
    }

    public dragstart() {
        this.drawnCoords = [];
        this.dynPath.attr('d', null);
        this.closePath.attr('d', null);
    }
    public dragmove(event: any) {
        const { x, y } = event;
        const [tx, ty] = d3.pointer(event, this.mainG.node());
        if (this.tpath === '') {
            this.tpath = this.tpath + 'M ' + tx + ' ' + ty;
            this.origin = [x, y];
            this.torigin = [tx, ty];
            // Draw origin node
            this.originNode.attr('cx', tx).attr('cy', ty).attr('r', 7).attr('display', null);
        } else {
            this.tpath = this.tpath + ' L ' + tx + ' ' + ty;
        }

        this.drawnCoords.push([x, y]);

        // Calculate the current distance from the lasso origin
        const distance = Math.sqrt(Math.pow(x - this.origin[0], 2) + Math.pow(y - this.origin[1], 2));

        // Set the closed path line
        const closeDrawPath = 'M ' + tx + ' ' + ty + ' L ' + this.torigin[0] + ' ' + this.torigin[1];

        // Draw the lines
        this.dynPath.attr('d', this.tpath);
        this.closePath.attr('d', closeDrawPath);

        const closePathDistance = 75;
        const closePathSelect = true;

        // Check if the path is closed
        const isPathClosed = distance <= closePathDistance ? true : false;

        this.selectedNodes = [];
        this.project.integrations.forEach(integration => {
            const pInt = [integration.x!, integration.y!];
            const point = this.transformPt(pInt);
            const selected = this.pointInPolygon(point, this.drawnCoords);
            if (selected) {
                this.selectedNodes.push(integration.id);
            }
        });
        this.st.nodes.classed('possible', (d: Integration) => this.selectedNodes.indexOf(d.id) > -1);
        // If within the closed path distance parameter, show the closed path. otherwise, hide it
        if (isPathClosed && closePathSelect) {
            this.closePath.attr('display', null);
        } else {
            this.closePath.attr('display', 'none');
        }
    }
    public transformPt(pt: number[]) {
        return [pt[0] * this.transform.k + this.transform.x, pt[1] * this.transform.k + this.transform.y];
    }
    public unTransformPt(pt: number[]) {
        return [pt[0] / this.transform.k - this.transform.x, pt[1] / this.transform.k - this.transform.y];
    }
    public dragend() {
        // Clear lasso
        this.tpath = '';
        this.drawnCoords = [];
        this.dynPath.attr('d', null);
        this.closePath.attr('d', null);
        this.originNode.attr('display', 'none');
        this.selectedActivities = [];
        this.selectActivities();
        this.project.profile.view.isSubProjSelected = this.isSubProject();
        this.project.profile.view.lassoedLinks = this.selectedActivities;
        this.project.profile.view.lassoedNodes = this.selectedNodes;
        this.project.profile.view.lassoStart = this.lassoStart;
        this.project.profile.view.lassoEnd = this.lassoEnd;
        this.lassoEnd = null;
        this.lassoStart = null;
        this.selectedNodes = [];
        this.dashboard.updateProject(this.project, false);
    }

    private isSubProject() {
        if (this.selectedNodes.length < 3) {
            return false;
        }
        const inFromExternal: Activity[] = [];
        const outToExternal: Activity[] = [];
        this.project.activities.forEach(a => {
            if (this.selectedNodes.indexOf(a.chartInfo.target_id) > -1 && this.selectedNodes.indexOf(a.chartInfo.source_id) === -1) inFromExternal.push(a);
            if (this.selectedNodes.indexOf(a.chartInfo.source_id) > -1 && this.selectedNodes.indexOf(a.chartInfo.target_id) === -1) outToExternal.push(a);
        });
        const selectedStarts: number[] = [];
        const selectedEnds: number[] = [];
        this.selectedNodes.forEach(n => {
            const outEdges = this.project.activities.filter(a => a.chartInfo.source_id === n);
            const hasSelectedTarget = outEdges.find(a => this.selectedNodes.indexOf(a.chartInfo.target_id) > -1);
            if (!hasSelectedTarget) {
                selectedEnds.push(n);
            }
            const inEdges = this.project.activities.filter(a => a.chartInfo.target_id === n);
            const hasSelectedSource = inEdges.find(a => this.selectedNodes.indexOf(a.chartInfo.source_id) > -1);
            if (!hasSelectedSource) {
                selectedStarts.push(n);
            }
        });
        if (selectedEnds.length > 1 || selectedStarts.length > 1) {
            return false;
        }
        const conflictingArrow = this.project.activities.find(a => {
            return a.chartInfo.target_id === selectedEnds[0] && a.chartInfo.source_id === selectedStarts[0];
        });
        if (conflictingArrow) {
            return false;
        }
        this.lassoStart = selectedStarts[0];
        this.lassoEnd = selectedEnds[0];
        const inFromExternalIds = inFromExternal.map(a => a.chartInfo.target_id);
        const outToExternalIds = outToExternal.map(a => a.chartInfo.source_id);
        const externallyConnectedOutNodes = inFromExternalIds.filter(x => selectedStarts.indexOf(x) === -1 && selectedEnds.indexOf(x) === -1);
        const externallyConnectedInNodes = outToExternalIds.filter(x => selectedStarts.indexOf(x) === -1 && selectedEnds.indexOf(x) === -1);
        return externallyConnectedOutNodes.length === 0 && externallyConnectedInNodes.length === 0;
    }

    private selectActivities() {
        this.project.activities.forEach(a => {
            if (this.selectedNodes.indexOf(a.chartInfo.source_id) > -1 && this.selectedNodes.indexOf(a.chartInfo.target_id) > -1) {
                this.selectedActivities.push(a.profile.id);
            }
        });
        this.st.links.classed('possible', (d: Activity) => this.selectedActivities.indexOf(d.profile.id) > -1);
    }
    private pointInPolygon(point: number[], polygon: number[][]): boolean {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        let xi,
            xj,
            yi,
            yj,
            i,
            intersect,
            x = point[0],
            y = point[1],
            inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            (xi = polygon[i][0]),
                (yi = polygon[i][1]),
                (xj = polygon[j][0]),
                (yj = polygon[j][1]),
                (intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    }
}
