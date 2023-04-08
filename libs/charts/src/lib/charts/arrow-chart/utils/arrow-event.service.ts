import { Inject, Injectable } from '@angular/core';
import { ArrowState } from '../arrow-state/arrow-state';
import { ElPositionerService } from './el-positioner.service';
import { ElFactoryService } from './el-factory.service';
import { NetworkOperationsService } from '../../../services/network-operations/network-operations.service';
import { MilestoneFactoryService } from '@critical-pass/shared/project-utils';
import { Activity, Integration, Project } from '@critical-pass/project/types';
import { ArrowStateService } from '../arrow-chart-ui/arrow-chart-ui.service';
import * as CONST from '../../../constants/constants';
@Injectable({
    providedIn: 'root',
})
export class ArrowEventsService {
    constructor(
        private networkOps: NetworkOperationsService,
        private msFactory: MilestoneFactoryService,
        private elFactory: ElFactoryService,
        private st: ArrowStateService,
    ) {}
    public checkDeselect(project: Project): boolean {
        return this.st.selected_node ||
            project.profile.view.selectedActivity !== null ||
            project.profile.view.selectedIntegration !== null ||
            this.st.selected_link
            ? true
            : false;
    }
    public deselectActivity(project: Project): void {
        project.activities.forEach(a => (a.chartInfo.isSelected = false));
        project.profile.view.selectedActivity = null;
        this.st.selected_link = null;
        this.st.links?.classed('selected', false);
    }
    private filterOutMilestones(proj: Project): Activity[] {
        return proj.activities.filter(x => x.chartInfo.milestoneNodeId === null);
    }
    public deselectNode(project: Project): void {
        project.integrations.forEach(a => (a.selected = false));
        project.profile.view.selectedActivity = null;
        project.profile.view.selectedIntegration = null;
        this.st.selected_node = null;
        this.st.links?.classed('selected', false);
    }
    private selectNode(node: Integration, project: Project): void {
        project.integrations.forEach(n => (n.selected = n.id === node.id));
        project.profile.view.selectedIntegration = node;
    }
    private sortNodes(d: Integration, nodes: any): void {
        nodes.sort((a: Integration, b: Integration) => {
            if (a.id !== d.id) {
                return 1;
            } else {
                return -1;
            }
        });
    }
    private initNodeDragState(d: Integration, el: any, proj: Project): void {
        this.st.nodes.classed('selected', (p: Integration) => d == p);
        this.deselectNode(proj);

        if (!d.selected) {
            d.selected = true;
        }

        // Turn off active: blue bold resting stroke
        this.st.nodes.select('circle').classed('active', false);

        // we are dragging
        this.st.drag_node = d;

        // sort so draging node is on the bottom so drag over is detected
        this.sortNodes(this.st.drag_node, this.st.nodes);
    }
    private deactivateSelectedNode(proj: Project, el: any): void {
        this.deselectNode(proj);
        el.select('circle').classed('active', false);
    }
    private activateSelectedNode(d: Integration, el: any, proj: Project): void {
        el.classed('selected', (d.selected = true));
        this.st.selected_node = this.st.mousedown_node;
        this.st.last_selected_node = this.st.mousedown_node;
        this.selectNode(this.st.selected_node!, proj);
        el.select('circle').classed('active', true);
    }
    private hideDragLine(): void {
        this.st.drag_line.classed('hidden', true).style('marker-end', '');
    }
    private updateDragLine(baseNode: Integration): void {
        this.st.drag_line.style('marker-end', 'url(#end-arrow)').classed('hidden', false).attr('d', `M${baseNode.x},${baseNode.y}L${baseNode.x},${baseNode.y}`);
    }
    private createArrowEvent(d: Integration, proj: Project): boolean {
        // Create a new arrow / activity from regular click drag arrow
        // No arrow being drawn
        if (!this.st.mousedown_node) {
            return false;
        }

        // hide drag line
        this.hideDragLine();

        // check for drag-to-self
        this.st.mouseup_node = d;
        if (this.st.mouseup_node === this.st.mousedown_node) {
            this.resetState();
            return false;
        }

        // unenlarge target node when successfully creating an arrow
        this.st.nodes.selectAll('circle').attr('transform', (p: Integration) => {
            return '';
        });
        let source = this.st.mousedown_node;
        let target = this.st.mouseup_node;
        if (source === target) {
            return false;
        }

        let targetActivity = this.filterOutMilestones(proj).filter(l => l.chartInfo.source === source && l.chartInfo.target === target)[0];

        // An arrow already exists
        if (!targetActivity) {
            targetActivity = this.elFactory.addProjectActivity(source, target, proj);

            // This is after you draw the element, move focus to text box so you can immediately type name
            const focusAfterCreation = this.st.activity_created;
            if (focusAfterCreation != null && proj.profile.view.displayText === 'name') {
                setTimeout(() => {
                    focusAfterCreation.next(true);
                }, 100);
            }
        }
        // select new link, selected_link is what is used when the diagram is redrawn to class the g element so it shows as selected
        this.st.selected_link = targetActivity;
        this.setLinkIsSelected(targetActivity, proj, true);
        if (this.st.selected_node != null) {
            this.st.selected_node.selected = false;
        }
        proj.profile.view.selectedIntegration = null;
        this.st.selected_node = null;
        return true;
    }
    private setLinkIsSelected(activity: Activity | null, proj: Project, isSelected: boolean): void {
        if (activity?.chartInfo) {
            activity.chartInfo.isSelected = isSelected;
            proj.profile.view.selectedActivity = activity;
        }
        if (!isSelected) {
            proj.profile.view.selectedActivity = null;
        }
    }
    private resetState(): void {
        this.st.mousedown_node = null;
        this.st.mouseup_node = null;
        this.st.mousedown_link = null;
        this.st.drag_node = null;
    }

    public setNodeDownStates(d: Integration, ctrlDown: boolean, el: any, proj: Project) {
        this.deselectActivity(proj);

        // Added in because the arrows and proj are not redrawn. Selected_link does set selected class for arrows, but only on data.next()
        this.st.blockDelete = false;

        // Set selected class to darken node and clear  bold outline of node via active = false
        if (ctrlDown) {
            this.initNodeDragState(d, el, proj);
            return;
        }
        this.st.mousedown_node = d;
        this.st.nodes.select('circle').classed('active', false);
        // Clear selected (for bold outline) if already selected and previoius selected and mousedown are the same
        if (this.st.selected_node !== null && this.st.mousedown_node.id === this.st.selected_node.id) {
            // If the node was pressed and there is already a selected node toggle active class off
            this.deactivateSelectedNode(proj, el);
        } // Needs to be all nodes because this toggles off previous selected
        else {
            this.activateSelectedNode(d, el, proj);
        }

        // reposition drag line
        this.updateDragLine(this.st.mousedown_node);
    }

    public joinNodesOrCreateArrow(target: Integration, proj: Project): boolean {
        const el = this.st.nodes.filter((d: Integration) => d == target);
        const msupnd = this.st.mouseover_node;
        let updated = false;
        // Round x and y on mouseup for saving
        target.x = Math.round(target.x!);
        target.y = Math.round(target.y!);
        // these were moved from global mouseup event because this drag/start/end event is blocking the mouseup. It worked when I moved
        if (msupnd != null) {
            const circle = msupnd.el.select('circle');
            // Check Join nodes from ctrl + drag, then check creating arrow
            updated = this.joinNodesEvent(msupnd.d, circle, proj);
            if (!updated) {
                updated = this.createArrowEvent(msupnd.d, proj);
            }
            this.st.nodes?.classed('selected', false);
        }
        this.clearSelectionAndHideLine();
        return updated;
    }
    public clearSelectionAndHideLine(): void {
        if (this.st.mousedown_node) {
            this.st.drag_line.classed('hidden', true).style('marker-end', '');
            this.st.nodes?.classed('selected', false);
        }
        this.st.mainG.classed('active', false);
        return this.resetState();
    }
    public setMouseOverNodeStates(d: Integration, el: any): void {
        this.st.mouseover_node = { d, el };

        // Enlarge the node when dragging arrow mouse over
        if (this.st.drag_node != null && d !== this.st.drag_node) {
            el.select('circle').attr('transform', (p: Integration) => {
                if (d === p) {
                    return 'scale(1.3)';
                } else return '';
            });
        }
        // Enlarge the node when joining nodes mouse over (don't enlarge on drag to self)
        if (!this.st.mousedown_node || d === this.st.mousedown_node) {
            return;
        }
        el.select('circle').attr('transform', (p: Integration) => {
            if (d === p) {
                return 'scale(1.1)';
            } else {
                return '';
            }
        });
    }
    public clearMouseOverNodeStates(d: Integration, el: any): void {
        this.st.mouseover_node = null;

        // Shrink node back to regular size when dragging arrow mouse out
        if (this.st.drag_node != null && d !== this.st.drag_node) {
            el.select('circle').attr('transform', (p: Integration) => {
                return '';
            });
        }
        // Shrink node back to regular size when ctrl + drag node mouse out
        if (!this.st.mousedown_node || d === this.st.mousedown_node) {
            return;
        }
        el.select('circle').attr('transform', (p: Integration) => {
            return '';
        });
    }
    public setSelectedLinkState(d: Activity, ctrlKey: boolean, proj: Project): boolean {
        if (ctrlKey) {
            return false;
        }
        this.st.blockDelete = false;

        this.st.mousedown_link = d;
        if (this.st.selected_link !== null && this.st.mousedown_link.profile.id === this.st.selected_link.profile.id) {
            this.setLinkIsSelected(null, proj, false);

            // Remove highlight link with css class
            this.st.links.classed('selected', false);
            this.st.selected_link = null;
        } else {
            this.st.selected_link = this.st.mousedown_link;
            this.setLinkIsSelected(this.st.selected_link, proj, true);

            // Highlight link with css class
            this.st.links.classed('selected', (a: any) => a === d);
        }
        if (this.st.selected_node != null) {
            this.st.selected_node.selected = false;
        }
        // Maybe make a function that sets the selected_node and one that sets the selected_link and also sets the css
        this.st.selected_node = null;
        proj.profile.view.selectedIntegration = null;

        // Deselect selected node when arrow is selected. THe arrows/proj are not redrawn so need to set classed here
        this.st.nodes.select('circle').classed('selected', false);
        this.st.nodes.select('circle').classed('active', false);
        return true;
    }

    private joinNodesEvent(dragTarget: Integration, el: any, proj: Project): boolean {
        // drag_node is the node being moved when ctrl + drag is performed
        // if drag_node, join nodes
        if (this.st.drag_node != null) {
            // If dragging to self, reset mouse stuff return false
            if (dragTarget === this.st.drag_node) {
                this.resetState();
                return false;
            }

            // (on join) return circle to normal size
            el.select('circle').attr('transform', (p: any) => {
                return '';
            });
            const target = this.st.drag_node;
            const source = dragTarget;
            if (source.id === target.id) {
                return false;
            }
            this.st.drag_node = null;
            this.networkOps.joinNodes(source, target, proj);

            return true;
        }
        return false;
    }
    public makeDummy(): void {
        if (this.st.selected_node) {
            this.st.selected_node.isDummy = !this.st.selected_node.isDummy;
        }
    }
    public makeMilestone(proj: Project): void {
        if (this.st.selected_node) {
            this.msFactory.createMilestone(proj, this.st.selected_node);
        }
    }
    public splitUpNode(integration: Integration, proj: Project) {
        const newNodes = this.networkOps.splitUpNode(integration, proj);
        proj.profile.view.selectedIntegration = null;
    }
}
