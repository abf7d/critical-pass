import { Inject, Injectable, NgZone } from '@angular/core';
import * as d3 from 'd3';
import * as CONST from '../../../constants/constants';
import { Key } from 'ts-keycode-enum';
import { ArrowState, ArrowStateFactory } from '../arrow-state/arrow-state';
import { Subscription, Observable, BehaviorSubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LassoToolService } from '../lasso-tool/lasso-tool.service';
import { ArrowControllerService } from '../utils/arrow-controller.service';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { NodeArrangerService } from '@critical-pass/shared/project-utils';
import { Activity, Integration, Project } from '@critical-pass/project/types';
@Injectable({
    providedIn: 'root',
})
export class ArrowChartUIService {
    private id!: number;
    public st!: ArrowState;
    private width!: number;
    private height!: number;
    private data!: Observable<Project>;
    private sub!: Subscription;
    public projIsEmpty: BehaviorSubject<boolean>;
    private proj!: Project;
    private arrowRisk: Map<number, number> = new Map<number, number>();
    private nodeRisk: Map<number, number> = new Map<number, number>();
    private rebuild!: boolean;
    private prevProjId!: number;

    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        private ngZone: NgZone,
        private lassoTool: LassoToolService,
        private controller: ArrowControllerService,
        private nodeArranger: NodeArrangerService,
    ) {
        this.projIsEmpty = new BehaviorSubject(true);
    }

    public init(width: number, height: number, id: number, rebuild: boolean, el: any) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.rebuild = rebuild;
        this.st = new ArrowStateFactory().create();
        this.initSvg(width, height, el);
        this.bindGlobalEvents();
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
        this.controller.deselectActivity(this.proj);
        this.controller.deselectNode(this.proj);
        this.dashboard.updateProject(this.proj, false);
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
        this.controller.st = this.st;
        if (this.rebuild) {
            this.clearElements();
        }
        if (isEmpty) {
            return;
        }
        this.zoom(project);
        this.createArrowHeads();
        this.createNodes(project);
        this.createArrows(project);
        this.buildDict(project);
        this.buildLasso(project);

        this.prevProjId = project.profile.id;
    }

    private buildLasso(project: Project): void {
        if (project.profile.view.lassoOn === true) {
            this.lassoTool.init(this.st, project, this.id);
        } else {
            this.lassoTool.remove(this.st, this.id);
        }
    }
    private buildDict(project: Project): void {
        this.arrowRisk = new Map<number, number>();
        project.activities.forEach((a, i) => this.arrowRisk.set(a.profile.id, a.chartInfo.risk));
        this.nodeRisk = new Map<number, number>();
        project.integrations.forEach((n, i) => this.nodeRisk.set(n.id, n.risk));
    }
    private clearElements(): void {
        this.st.mainG.selectAll('g.link').remove();
        this.st.mainG.selectAll('g.node').remove();
        this.st.mainG.selectAll('defs').remove();
        this.st.mainG.selectAll('g.missing-data').remove();
    }

    private createNodes(project: Project): void {
        this.st.nodes = this.st.mainG.append('g').attr('class', 'node').selectAll('g');

        let nodeContainer = this.st.mainG.select('g.node');
        if (nodeContainer.empty()) {
            nodeContainer = this.st.mainG.append('g').attr('class', 'node');
        }
        const nodeParent = nodeContainer.selectAll('g');
        const transition = d3.transition().duration(CONST.TRANSITION_TIME).ease(CONST.ARROW_EASE_TYPE);
        const withData = nodeParent.data(project.integrations, (i: Integration) => i.id);
        withData.exit().remove();
        const enterNodes = withData
            .enter()
            .append('g')
            .attr('class', (d: Integration) => this.controller.getNodeCss(d, project))
            .classed('milestone', (m: Integration) => m.isMilestone)
            .classed('completed', (d: Integration) => project.profile.view.markCompleted && d.completed)
            .attr('transform', (d: Integration) => `translate(${d.x},${d.y})`);

        // Main node circle
        enterNodes
            .append('circle')
            .attr('r', (m: Integration) => (m.isMilestone ? 14 : 12))
            .classed('node', true)
            .classed('dummy', (d: Integration) => d.isDummy)
            .classed('active', (d: Integration) => d === this.st.selected_node)
            .classed('last-selected', (d: Integration) => d === this.st.last_selected_node);
            
        // Inner text
        enterNodes
            .append('text')
            .attr('class', 'label')
            .attr('text-anchor', 'middle')
            .attr('y', '.3em')
            .text((d: Integration) => this.controller.getNodeName(d));

        // Text above circle
        if (project.profile.view.showEftLft !== 'none') {
            enterNodes
                .append('text')
                .attr('class', 'label float risk-stats')
                .attr('text-anchor', 'middle')
                .attr('y', (d: Integration) => (d.isMilestone ? '-2.3em' : '-1.9em'))
                .text((d: Integration) => this.controller.getTextAboveNode(d, project));
        }

        const dragNodeEvent = d3
            .drag()
            .filter(event => !event.button)
            .on('start', d => {})
            .on('drag', (event: any, d: unknown) => {
                this.controller.onNodeGroupDrag([event.x, event.y], event.dx, event.dy, d as Integration, project);
            })
            .on('end', (event: any, d: unknown) => {
                this.controller.onNodeGroupMouseUp(d as Integration, project);
                this.dashboard.updateProject(project, true);
            });
        enterNodes
            .on('mousedown', (event: any, d: Integration) => {
                this.st.allowDeletes = true;
                const ctrlDown = event.ctrlKey || event.metaKey;
                this.controller.onNodeGroupMouseDown(d, ctrlDown, d3.select(event.currentTarget), project);
            })
            .on('mouseover', (event: any, d: Integration) => this.controller.onNodeMouseOver(d, d3.select(event.currentTarget)))
            .on('mouseout', (event: any, d: Integration) => this.controller.onNodeMouseOut(d, d3.select(event.currentTarget)))
            .call(dragNodeEvent);

        const allNodes = enterNodes.merge(withData);

        const skipAnimation = this.prevProjId !== project.profile.id;
        allNodes
            .style('stroke', (d: Integration) => this.controller.getNodeColor(true, d, project, this.nodeRisk, skipAnimation))
            .transition(transition)
            .style('stroke', (d: Integration) => this.controller.getNodeColor(false, d, project, this.nodeRisk, skipAnimation));

        this.st.nodes = allNodes;
    }

    private createArrows(proj: Project): void {
        let arrowContainer = this.st.mainG.select('g.link');
        if (arrowContainer.empty()) {
            arrowContainer = this.st.mainG.append('g').attr('class', 'link');
        }
        const arrowParent = arrowContainer.selectAll('g.activity');
        const activities = proj.activities.filter(x => !x.chartInfo.milestoneNodeId);
        const withData = arrowParent.data(activities, (d: Activity) => {
            return d.profile.id;
        });
        withData.exit().remove();
        const enterLinks = withData
            .enter()
            .append('g')
            .attr('class', 'activity')
            .on('mouseover', (event: any) => d3.select(event.currentTarget).classed('hover', true))
            .on('mouseout', (event: any) => d3.select(event.currentTarget).classed('hover', false))
            .on('mousedown', (event: any, d: Activity) => {
                this.st.allowDeletes = true;
                this.controller.setMouseDownLink(d, event.ctrlKey, proj);
                this.dashboard.updateProject(proj, true);
                event.stopPropagation();
            });

        this.createArrowBody(proj, enterLinks);
        this.createMainArrowText(proj, enterLinks);
        this.createTextGlow(proj, enterLinks);
        this.createLowerText(proj, enterLinks);

        const allLinks = enterLinks.merge(withData);
        const transition = d3.transition().duration(CONST.TRANSITION_TIME).ease(CONST.ARROW_EASE_TYPE);
        const skipAnimation = this.prevProjId !== proj.profile.id;
        allLinks
            .attr('class', (a: Activity) => this.controller.getLinkCss(a, proj))
            .classed('completed', (a: Activity) => this.controller.isCompleted(a, proj))
            .classed('selected', (a: Activity) => this.controller.isSelected(a, proj))
            .classed('sub-project', (a: Activity) => this.controller.isHighlighted(a, proj))
            .style('stroke', (d: Activity) => this.controller.getArrowColor(true, d, proj, this.arrowRisk, skipAnimation))
            .transition(transition)
            .style('stroke', (d: Activity) => this.controller.getArrowColor(false, d, proj, this.arrowRisk, skipAnimation));
        this.st.links = allLinks;
        proj.profile.view.activeSubProjectId = undefined;
    }
    private createMainArrowText(proj: Project, enterLinks: any): void {
        enterLinks
            .append('text')
            .attr('class', 'label')
            .classed('selected', (d: Activity) => d === this.st.selected_link)
            .attr('y', (l: Activity) => this.controller.getLinkTextPosY(l, proj))
            .attr('x', (l: Activity) => this.controller.getLinkTextPosX(l, proj))
            .style('font-size', (l: Activity) => this.controller.getActivityFontSize(l, proj))
            .style('text-anchor', 'middle')
            .text((l: Activity) => this.controller.getLinkText(l, proj));
    }
    private createArrowBody(proj: Project, enterLinks: any): void {
        enterLinks
            .append('svg:path')
            .attr('class', 'link main')
            .classed('dummy', (d: Activity) => d.chartInfo.isDummy)
            .classed('selected', (d: Activity) => d === this.st.selected_link)
            .attr('d', (d: Activity) => this.controller.getPath(d))
            .style('marker-end', (a: Activity) => this.controller.getLinkEndMarker(a, proj));
    }

    private createTextGlow(proj: Project, enterLinks: any): void {
        enterLinks
            .insert('text', 'text')
            .attr('class', 'glow')
            .style('font-size', (l: Activity) => this.controller.getActivityFontSize(l, proj))
            .attr('y', (l: Activity) => this.controller.getLinkTextPosY(l, proj))
            .attr('x', (l: Activity) => this.controller.getLinkTextPosX(l, proj))
            .text((l: Activity) => this.controller.getLinkText(l, proj));
    }
    private createLowerText(proj: Project, enterLinks: any): void {
        enterLinks
            .append('text')
            .attr('class', 'label float')
            .attr('y', (l: Activity) => this.controller.getLowerLinkTextYPos(l, proj))
            .attr('x', (l: Activity) => this.controller.getLowerLinkTextXPos(l, proj))
            .style('text-anchor', 'middle')
            .text((l: Activity) => this.controller.getLowerLinkText(l, proj))
            .style('font-size', (l: Activity) => this.controller.getActivityFontSize(l, proj));
    }

    private createArrowHeads(): void {
        const arrowHeads = this.st.mainG.append('svg:defs').selectAll('marker');
        this.addArrowHead(arrowHeads, 'end-0', 'risk-0');
        this.addArrowHead(arrowHeads, 'end-1', 'risk-1');
        this.addArrowHead(arrowHeads, 'end-2', 'risk-2');
        this.addArrowHead(arrowHeads, 'end-3', 'risk-3');
        this.addArrowHead(arrowHeads, 'end-undefined', 'risk-undefined');
        this.addArrowHead(arrowHeads, 'end-u', 'unprocessed');
        this.addArrowHead(arrowHeads, 'end-completed', 'completed');
        arrowHeads
            .data(['end-arrow'])
            .enter()
            .append('svg:marker')
            .attr('id', String)
            .attr('class', 'endarrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 6)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#000');
    }
    private addArrowHead(svg: any, id: string, risk: string): void {
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
    private zoom(project: Project): void {
        if (project.profile.view.lassoOn == true) {
            this.st.svg.on('.zoom', null);
            return;
        }
        if (project.integrations.length < 2) {
            project.profile.view.autoZoom = false;
            return;
        }

        const groupZoom = this.getSvgZoom(project);

        if (groupZoom) {
            const origin = this.getZoomOrigin(project);

            // handle smooth click and drag by setting scale and translate
            d3.zoom().translateTo(this.st.svg, origin.translate[0], origin.translate[1]);
            d3.zoom().scaleTo(this.st.svg, origin.scale);
        }

        // Sets actual wheel zoom and click-drag pan
        this.st.svg.call(
            d3.zoom().on('zoom', (event, d) => {
                this.st.mainG.attr('transform', event.transform);
                this.lassoTool.setTransform(event.transform);
            }),
        );

        if (groupZoom != null) {
            // Zoom and scale the viewport within bounds of nodes
            this.st.mainG.attr('transform', `translate(${groupZoom.translate})scale(${groupZoom.scale})`);
            this.lassoTool.setTransform({ k: groupZoom.scale, x: groupZoom.translate[0], y: groupZoom.translate[1] });
        }
    }
    private getSvgZoom(project: Project): ZoomTransform | null {
        // These values help offset the initial zoom/pan when the page loads
        // The drawn position isn't the same as the point at which the zoom/pan begins
        // and there is a jump. These offsets for the translations help fix this.
        const transOffsetX = 0;
        const transOffsetY = 0;
        if (project == null || project.integrations.length === 0) {
            return { scale: 1, translate: [transOffsetX, transOffsetY] };
        }

        if (!project.profile.view.autoZoom) {
            return null;
        }
        project.profile.view.autoZoom = false;

        const xPos = project.integrations.map(i => i.x) as number[];
        const yPos = project.integrations.map(i => i.y) as number[];
        const maxX = Math.max(...xPos);
        const minX = Math.min(...xPos);
        const maxY = Math.max(...yPos);
        const minY = Math.min(...yPos);

        const marginX = 0;
        const marginY = 0;

        const dx = maxX - minX;
        const dy = maxY - minY;
        const x = (maxX + minX) / 2;
        const y = (maxY + minY) / 2;
        const scale = 0.9 / Math.max(dx / this.width, dy / this.height);
        const transX = this.width / 2 - scale * x - marginX;
        const transY = this.height / 2 - scale * y - marginY;
        const translate: [number, number] = [transX, transY];

        return { translate, scale };
    }
    private getZoomOrigin(project: Project): ZoomTransform {
        const xPos = project.integrations.map(i => i.x) as number[];
        const yPos = project.integrations.map(i => i.y) as number[];
        const maxX = Math.max(...xPos);
        const minX = Math.min(...xPos);
        const maxY = Math.max(...yPos);
        const minY = Math.min(...yPos);

        // Center needs to be halfway between min and max then moved over the min aamount
        const x = (maxX - minX) / 2 + minX; // don't know why this is happening
        const y = (maxY - minY) / 2 + minY;
        const translate: [number, number] = [x, y];

        const dx = maxX - minX;
        const dy = maxY - minY;
        const scale = 0.9 / Math.max(dx / this.width, dy / this.height);

        return { translate, scale };
    }

    private bindGlobalEvents(): void {
        this.st.svg
            .on('dblclick', (event: any) => {
                event.preventDefault();
                this.dblclick(event);
            })
            .on('click', (event: any) => {
                this.st.allowDeletes = true;
                this.st.last_selected_node = null;
            })
            .on('mousemove', (event: any) => this.mousemove(event))
            .on('mouseup', () => this.mouseup());

        d3.select(window)
            .on('keydown', event => {
                this.keydown(event);
                this.lassoTool.keydown(event);
            })
            .on('keyup', event => {
                this.keyup(event);
                this.lassoTool.keyup(event);
            });
    }

    private dblclick(event: any): void {
        // prevent I-bar on drag
        if (!event.ctrlKey || this.st.drag_node != null) {
            event.stopPropagation();
        }
        this.st.mainG.classed('active', true);
        const proceed = this.controller.handleNodeCreation(event.ctrlKey, d3.pointer(event, this.st.mainG.node()), this.proj);
        if (!proceed) {
            return;
        }
        this.dashboard.updateProject(this.proj, true);
    }

    private mousemove(event: any): void {
        if (!event.ctrlKey) {
            event.stopPropagation();
        }
        this.controller.updateLinePos(d3.pointer(this.st.mainG.node()));
    }

    private mouseup(): void {
        this.controller.clearClassesAndHideLine();
    }

    private keydown(event: any): void {
        if ((this.st.lastKeyDown === Key.Ctrl || this.st.macMetaDown) && event.keyCode === Key.X) {
            // prevents default actions like copy paste and maximizing browsers
            event.preventDefault();
            if (this.st.selected_node != null) {
                this.controller.splitUpNode(this.st.selected_node, this.proj);
            }
            this.dashboard.updateProject(this.proj, true);
        }
        // Make node a dummy
        if ((this.st.lastKeyDown === Key.Ctrl || this.st.macMetaDown) && event.keyCode === Key.D) {
            event.preventDefault();
            this.controller.makeDummy();
            this.dashboard.updateProject(this.proj, true);
        }
        // Make node a milestone
        if ((this.st.lastKeyDown === Key.Ctrl || this.st.macMetaDown) && event.keyCode === Key.M) {
            event.preventDefault();
            this.controller.makeMilestone(this.proj);
            this.dashboard.updateProject(this.proj, true);
        }

        // On a mac you don't check lastKeyDown, you check if metaKey is true for cmd key.
        // Check for a delete with cmd + backspace.
        if (event.keyCode === Key.Backspace && event.metaKey) {
            if (this.st.allowDeletes) {
                this.controller.deleteSelectedNodeOrLink(this.proj);
                this.dashboard.updateProject(this.proj, true);
            }
        }

        if (this.st.lastKeyDown) {
            return;
        }
        this.st.lastKeyDown = event.keyCode;

        if (event.metaKey) {
            event.preventDefault();
            this.st.macMetaDown = true;
            this.st.ctrl_down = true;
        }

        if (event.keyCode === Key.Ctrl) {
            this.st.ctrl_down = true;
        }

        switch (event.keyCode) {
            case Key.Delete:
                if (this.st.allowDeletes) {
                    this.controller.deleteSelectedNodeOrLink(this.proj);
                    this.dashboard.updateProject(this.proj, true);
                }
                break;
        }
    }

    private keyup(event: any): void {
        this.st.lastKeyDown = null;

        if (this.st.macMetaDown && !event.metaKey) {
            this.st.macMetaDown = false;
            this.st.ctrl_down = false;
        }

        if (event.keyCode === Key.Ctrl) {
            this.st.ctrl_down = false;
        }
    }
}

export interface ZoomTransform {
    translate: [number, number];
    scale: number;
}
