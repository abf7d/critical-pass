import { Inject, Injectable, NgZone } from '@angular/core';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { Key } from 'ts-keycode-enum';
import { LassoToolService } from '../lasso-tool/lasso-tool.service';
import * as d3 from 'd3';
import { ArrowStateService } from '../../arrow-state/arrow-state';
import { ArrowControllerService } from '../../arrow-controller/arrow-controller.service';
@Injectable({
    providedIn: 'root',
})
export class EventBinderService {
    // TODO: make arrowState a service instead of an interface
    constructor(
        /*@Inject(CONST.ARROW_STATE_TOKEN)*/ private st: ArrowStateService,
        private controller: ArrowControllerService,
        private lassoTool: LassoToolService,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
    ) {}
    // private st!: ArrowState;
    public bindGlobalEvents(): void {
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
        const project = this.dashboard.activeProject$.getValue();
        const proceed = this.controller.handleNodeCreation(event.ctrlKey, d3.pointer(event, this.st.mainG.node()), project);
        if (!proceed) {
            return;
        }
        this.dashboard.updateProject(project, true);
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
        const project = this.dashboard.activeProject$.getValue();
        if ((this.st.lastKeyDown === Key.Ctrl || this.st.macMetaDown) && event.keyCode === Key.X) {
            // prevents default actions like copy paste and maximizing browsers
            event.preventDefault();
            if (this.st.selected_node != null) {
                this.controller.splitUpNode(this.st.selected_node, project);
            }
            this.dashboard.updateProject(project, true);
        }
        // Make node a dummy
        if ((this.st.lastKeyDown === Key.Ctrl || this.st.macMetaDown) && event.keyCode === Key.D) {
            event.preventDefault();
            this.controller.makeDummy();
            this.dashboard.updateProject(project, true);
        }
        // Make node a milestone
        if ((this.st.lastKeyDown === Key.Ctrl || this.st.macMetaDown) && event.keyCode === Key.M) {
            event.preventDefault();
            this.controller.makeMilestone(project);
            this.dashboard.updateProject(project, true);
        }

        // On a mac you don't check lastKeyDown, you check if metaKey is true for cmd key.
        // Check for a delete with cmd + backspace.
        if (event.keyCode === Key.Backspace && event.metaKey) {
            if (this.st.allowDeletes) {
                this.controller.deleteSelectedNodeOrLink(project);
                this.dashboard.updateProject(project, true);
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
                    this.controller.deleteSelectedNodeOrLink(project);
                    this.dashboard.updateProject(project, true);
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
