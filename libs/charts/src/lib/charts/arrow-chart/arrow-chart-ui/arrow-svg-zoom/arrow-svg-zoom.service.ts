import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/types';
import { ZoomTransform } from '../../../../models/zoom-transform';
import * as d3 from 'd3';
import { LassoToolService } from '../lasso-tool/lasso-tool.service';
import { ArrowStateService } from '../../arrow-state/arrow-state';

@Injectable({
    providedIn: 'root',
})
export class ArrowSvgZoomService {
    constructor(/*@Inject(CONST.ARROW_STATE_TOKEN)*/ private st: ArrowStateService, private lassoTool: LassoToolService) {}
    public zoom(project: Project): void {
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

        this.st.svg.on('dblclick.zoom', null);

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
        const scale = 0.9 / Math.max(dx / this.st.width!, dy / this.st.height!);
        const transX = this.st.width! / 2 - scale * x - marginX;
        const transY = this.st.height! / 2 - scale * y - marginY;
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
        const scale = 0.9 / Math.max(dx / this.st.width!, dy / this.st.height!);

        return { translate, scale };
    }
}
