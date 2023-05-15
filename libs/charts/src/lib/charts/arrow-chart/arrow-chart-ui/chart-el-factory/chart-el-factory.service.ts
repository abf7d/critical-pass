import { Inject, Injectable, NgZone } from '@angular/core';
import { Activity, Integration, Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import * as CONST from '../../../../constants/constants';
import * as d3 from 'd3';
import { ArrowStateService } from '../../arrow-state/arrow-state';
import { ArrowControllerService } from '../../arrow-controller/arrow-controller.service';
@Injectable({
    providedIn: 'root',
})
export class ChartElFactory {
    constructor(private st: ArrowStateService, private controller: ArrowControllerService, @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService) {}
    public createNodes(project: Project): void {
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
                const ctrlDown = this.st.ctrl_down || this.st.macMetaDown;
                this.controller.onNodeGroupMouseDown(d, ctrlDown, d3.select(event.currentTarget), project);
            })
            .on('mouseover', (event: any, d: Integration) => this.controller.onNodeMouseOver(d, d3.select(event.currentTarget)))
            .on('mouseout', (event: any, d: Integration) => this.controller.onNodeMouseOut(d, d3.select(event.currentTarget)))
            .call(dragNodeEvent);

        const allNodes = enterNodes.merge(withData);

        const skipAnimation = this.st.prevProjId !== project.profile.id;
        allNodes
            .style('stroke', (d: Integration) => this.controller.getNodeColor(true, d, project, this.st.nodeRisk, skipAnimation))
            //.transition(transition) // comment this out to fix component tests
            .style('stroke', (d: Integration) => this.controller.getNodeColor(false, d, project, this.st.nodeRisk, skipAnimation));

        this.st.nodes = allNodes;
    }

    public createArrows(proj: Project): void {
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
                this.controller.setMouseDownLink(d, this.st.ctrl_down, proj);
                this.dashboard.updateProject(proj, true);
                event.stopPropagation();
            });

        this.createArrowBody(proj, enterLinks);
        this.createMainArrowText(proj, enterLinks);
        this.createTextGlow(proj, enterLinks);
        this.createLowerText(proj, enterLinks);

        const allLinks = enterLinks.merge(withData);
        const transition = d3.transition().duration(CONST.TRANSITION_TIME).ease(CONST.ARROW_EASE_TYPE);
        const skipAnimation = this.st.prevProjId !== proj.profile.id;
        allLinks
            .attr('class', (a: Activity) => this.controller.getLinkCss(a, proj))
            .classed('completed', (a: Activity) => this.controller.isCompleted(a, proj))
            .classed('selected', (a: Activity) => this.controller.isSelected(a, proj))
            .classed('sub-project', (a: Activity) => this.controller.isHighlighted(a, proj))
            // TODO: st.arrowRisk and st.nodeRisk should not be passed into controller, they are on state service which isinjected
            .style('stroke', (d: Activity) => this.controller.getArrowColor(true, d, proj, this.st.arrowRisk, skipAnimation))
            //.transition(transition) // comment this out to fix component tests
            .style('stroke', (d: Activity) => this.controller.getArrowColor(false, d, proj, this.st.arrowRisk, skipAnimation));
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

    public createArrowHeads(): void {
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
    public clearElements(): void {
        this.st.mainG.selectAll('g.link').remove();
        this.st.mainG.selectAll('g.node').remove();
        this.st.mainG.selectAll('defs').remove();
        this.st.mainG.selectAll('g.missing-data').remove();
    }
}
