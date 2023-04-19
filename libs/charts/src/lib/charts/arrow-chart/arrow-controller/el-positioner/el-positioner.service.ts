import { Injectable } from '@angular/core';
import { Activity, Integration, Project } from '@critical-pass/project/types';
import { ArrowStateService } from '../../arrow-state/arrow-state';

@Injectable({
    providedIn: 'root',
})
export class ElPositionerService {
    constructor(private st: ArrowStateService) {}
    public nudgeGroup(dx: number, dy: number, dpt: Integration, proj: Project): void {
        this.moveNode(dx, dy);
        this.repositionConnectedArrows();
        this.repositionArrowText('text.label', proj);
        this.repositionArrowText('text.glow', proj);
        this.repositionArrowFloatText(proj);
    }
    public updateGroupPosition(project: Project, selectedNodes: number[]): void {
        this.repositionConnectedArrows(selectedNodes);
        this.repositionArrowText('text.label', project, selectedNodes);
        this.repositionArrowText('text.glow', project, selectedNodes);
        this.repositionArrowFloatText(project, selectedNodes);
    }

    private moveNode(dx: number, dy: number): void {
        this.st.nodes
            .filter((d: Integration) => d === this.st.drag_node)
            .attr('transform', (d: Integration) => {
                d.x! += dx;
                d.y! += dy;
                return `translate(${d.x},${d.y})`;
            });
    }
    private repositionConnectedArrows(selectedNodes: number[] | null = null): void {
        this.st.links
            .filter((d: Activity) => {
                // selectedNodes is not null when we are using lasso
                if (!selectedNodes) {
                    return d.chartInfo.source!.selected;
                }
                return selectedNodes.includes(d.chartInfo.source_id);
            })
            .select('path')
            .attr('d', (d: Activity) => this.getPath(d));

        this.st.links
            .filter((d: Activity) => {
                // selectedNodes is not null when we are using lasso
                if (!selectedNodes) {
                    return d.chartInfo.target!.selected;
                }
                return selectedNodes.includes(d.chartInfo.target_id);
            })
            .select('path')
            .attr('d', (d: Activity) => this.getPath(d));
    }
    private repositionArrowText(selector: string, proj: Project, selectedNodes: number[] | null = null): void {
        this.st.links
            .filter((d: Activity) => {
                // selectedNodes is not null when we are using lasso
                if (!selectedNodes) {
                    return d.chartInfo.target!.selected || d.chartInfo.source!.selected;
                }
                return selectedNodes.includes(d.chartInfo.source!.id!) || selectedNodes.includes(d.chartInfo.target!.id!);
            })
            .select(selector)
            .attr('y', (a: Activity) => {
                const cInfo = a.chartInfo;
                if (proj.profile.view.displayText === 'name') {
                    return cInfo.source!.y! + (cInfo.target!.y! - cInfo.source!.y!) / 2 - 14;
                }
                return cInfo.source!.y! + (cInfo.target!.y! - cInfo.source!.y!) / 2 - 6;
            })
            .attr('x', function (a: Activity) {
                const cInfo = a.chartInfo;
                if (proj.profile.view.displayText === 'name') {
                    return cInfo.source!.x! + (cInfo.target!.x! - cInfo.source!.x!) / 4;
                }
                return cInfo.source!.x! + (cInfo.target!.x! - cInfo.source!.x!) / 2;
            });
    }
    private repositionArrowFloatText(proj: Project, selectedNodes: number[] | null = null): void {
        this.st.links
            .filter((d: Activity) => {
                // selectedNodes is not null when we are using lasso
                if (!selectedNodes) {
                    return d.chartInfo.target!.selected || d.chartInfo.source!.selected;
                }
                return selectedNodes.includes(d.chartInfo.source!.id!) || selectedNodes.includes(d.chartInfo.target!.id!);
            })
            .select('text.float')
            .attr('y', (d: Activity) => d.chartInfo.source!.y! + (d.chartInfo.target!.y! - d.chartInfo.source!.y!) / 2 + 14)
            .attr('x', (a: Activity) => {
                const cInfo = a.subProject;
                const risk = a.risk;
                const chart = a.chartInfo;
                if (cInfo.subGraphLoaded !== null || cInfo.isParent || risk.criticalCount > 0 || risk.greenCount > 0) {
                    return chart.source!.x! + (chart.target!.x! - chart.source!.x!) / 2 - 25;
                }
                return chart.source!.x! + (chart.target!.x! - chart.source!.x!) / 2 - 3;
            });
    }
    public getPath(d: Activity): string {
        const deltaX = d.chartInfo.target!.x! - d.chartInfo.source!.x!;
        const deltaY = d.chartInfo.target!.y! - d.chartInfo.source!.y!;
        const distr = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normX = deltaX / distr;
        const normY = deltaY / distr;
        const sourcePadding = 12;
        const targetPadding = 17;
        const sourceX = d.chartInfo.source!.x! + sourcePadding * normX;
        const sourceY = d.chartInfo.source!.y! + sourcePadding * normY;
        const targetX = d.chartInfo.target!.x! - targetPadding * normX;
        const targetY = d.chartInfo.target!.y! - targetPadding * normY;
        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    }
    public setElPositions(point: [number, number], dx: number, dy: number, d: Integration, proj: Project): void {
        if (!this.st.ctrl_down) {
            // This needs to be here because global mousemove doesn't work when dragging
            this.updateLinePos(point);
        } else {
            // turn off the drag line if ctrl is clicked so there isn't an arrow head
            // laying around when the node is moved. Might want to put this inside a function
            this.st.drag_line.classed('hidden', true).style('marker-end', '');

            // Moving nodes only works if you click and drag first then hit ctrl
            this.nudgeGroup(dx, dy, d, proj);
        }
    }
    public updateLinePos(point: [number, number]): void {
        // its not registering the mousemove when click and drag the node. The the node drag takes over
        const mdn = this.st.mousedown_node;
        if (!mdn) {
            return;
        }

        this.st.drag_line.attr('d', `M${mdn.x},${mdn.y}L${point[0]},${point[1]}`);
    }
}
