import { Injectable } from '@angular/core';
import { Integration } from '../../../models/project/integration/integration';
import { Project } from '../../../models/project/project';
import { Activity } from '../../../models/project/activity/activity';
import { ArrowState } from '../arrow-state/arrow-state';

@Injectable({
    providedIn: 'root',
})
export class ElPositionerService {
    public st: ArrowState;
    public nudgeGroup(dx: number, dy: number, dpt: Integration, proj: Project): void {
        this.moveNode(dx, dy);
        this.repositionConnectedArrows();
        this.repositionArrowText('text.label', proj);
        this.repositionArrowText('text.glow', proj);
        this.repositionArrowFloatText(proj);
    }
    private moveNode(dx: number, dy: number): void {
        this.st.nodes
            .filter((d: Integration) => d === this.st.drag_node)
            .attr('transform', d => {
                d.x += dx;
                d.y += dy;
                return `translate(${d.x},${d.y})`;
            });
    }
    private repositionConnectedArrows(): void {
        this.st.links
            .filter((d: Activity) => {
                return d.chartInfo.source.selected;
            })
            .select('path')
            .attr('d', d => this.getPath(d));

        this.st.links
            .filter(d => d.chartInfo.target.selected)
            .select('path')
            .attr('d', d => this.getPath(d));
    }
    private repositionArrowText(selector: string, proj: Project): void {
        this.st.links
            .filter(d => d.chartInfo.target.selected || d.chartInfo.source.selected)
            .select(selector)
            .attr('y', function (a) {
                const cInfo = a.chartInfo;
                if (proj.profile.view.displayText === 'name') {
                    return cInfo.source.y + (cInfo.target.y - cInfo.source.y) / 2 - 14;
                }
                return cInfo.source.y + (cInfo.target.y - cInfo.source.y) / 2 - 6;
            })
            .attr('x', function (a) {
                const cInfo = a.chartInfo;
                if (proj.profile.view.displayText === 'name') {
                    return cInfo.source.x + (cInfo.target.x - cInfo.source.x) / 4;
                }
                return cInfo.source.x + (cInfo.target.x - cInfo.source.x) / 2;
            });
    }
    private repositionArrowFloatText(proj: Project): void {
        this.st.links
            .filter(d => d.chartInfo.target.selected || d.chartInfo.source.selected)
            .select('text.float')
            .attr('y', d => d.chartInfo.source.y + (d.chartInfo.target.y - d.chartInfo.source.y) / 2 + 14)
            .attr('x', function (a) {
                const cInfo = a.chartInfo;
                if (cInfo.subGraphLoaded !== null || cInfo.isParent || cInfo.criticalCount > 0 || cInfo.greenCount > 0) {
                    return cInfo.source.x + (cInfo.target.x - cInfo.source.x) / 2 - 25;
                }
                return cInfo.source.x + (cInfo.target.x - cInfo.source.x) / 2 - 3;
            });
    }
    public getPath(d: Activity): string {
        const deltaX = d.chartInfo.target.x - d.chartInfo.source.x;
        const deltaY = d.chartInfo.target.y - d.chartInfo.source.y;
        const distr = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normX = deltaX / distr;
        const normY = deltaY / distr;
        const sourcePadding = 12;
        const targetPadding = 17;
        const sourceX = d.chartInfo.source.x + sourcePadding * normX;
        const sourceY = d.chartInfo.source.y + sourcePadding * normY;
        const targetX = d.chartInfo.target.x - targetPadding * normX;
        const targetY = d.chartInfo.target.y - targetPadding * normY;
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
    public updateLinePos(point: [number, number]): boolean {
        // its not registering the mousemove when click and drag the node. The the node drag takes over
        const mdn = this.st.mousedown_node;
        if (!mdn) {
            return false;
        }

        this.st.drag_line.attr('d', `M${mdn.x},${mdn.y}L${point[0]},${point[1]}`);
    }
}
