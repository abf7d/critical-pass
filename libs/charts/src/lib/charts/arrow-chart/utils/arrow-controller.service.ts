import { Injectable } from '@angular/core';
import { ArrowEventsService } from './arrow-event.service';
import { ArrowPropertyService } from './arrow-property.service';
import { ElFactoryService } from './el-factory.service';
import { ElPositionerService } from './el-positioner.service';
import { ArrowState } from '../arrow-state/arrow-state';
import { Activity, Integration, Project } from '@critical-pass/project/types';

@Injectable({
    providedIn: 'root',
})
export class ArrowControllerService {
    constructor(
        private events: ArrowEventsService,
        private props: ArrowPropertyService,
        private factory: ElFactoryService,
        private positioner: ElPositionerService,
    ) {}
    set st(st: ArrowState) {
        this.events.st = st;
        this.props.st = st;
        this.factory.st = st;
        this.positioner.st = st;
    }
    public getPath(d: Activity): string {
        return this.positioner.getPath(d);
    }
    public onNodeGroupDrag(point: [number, number], dx: number, dy: number, d: Integration, proj: Project): void {
        return this.positioner.setElPositions(point, dx, dy, d, proj);
    }
    public updateLinePos(point: [number, number]): void {
        return this.positioner.updateLinePos(point);
    }
    public handleNodeCreation(ctrl: any, point: any, proj: Project): boolean {
        return this.factory.handleNodeCreation(ctrl, point, proj);
    }
    public deleteSelectedNodeOrLink(proj: Project): void {
        return this.factory.deleteSelectedNodeOrLink(proj);
    }
    public addFastActivity(event: any, proj: Project, mode: string, lastSelectedNode: Integration): Activity | null {
        return this.factory.addFastActivity(event, proj, mode, lastSelectedNode);
    }
    public getNodeName(d: Integration): string {
        return this.props.getNodeName(d);
    }
    public getTextAboveNode(d: Integration, project: Project): string {
        return this.props.getTextAboveNode(d, project);
    }
    public getNodeColor(old: boolean, a: Integration, proj: Project, risks: Map<number, number>, skipAnim: boolean): string {
        return this.props.getNodeColor(old, a, proj, risks, skipAnim);
    }
    public isCompleted(d: Activity, proj: Project): boolean {
        return this.props.isCompleted(d, proj);
    }
    public isSelected(a: Activity, proj: Project) {
        return this.props.isSelected(a, proj);
    }
    public isHighlighted(d: Activity, proj: Project): boolean {
        return this.props.isHighlighted(d, proj);
    }
    public getArrowColor(old: boolean, a: Activity, proj: Project, risks: Map<number, number>, skipAnim: boolean): string {
        return this.props.getArrowColor(old, a, proj, risks, skipAnim);
    }
    public getLinkTextPosY(d: Activity, proj: Project): number {
        return this.props.getLinkTextPosY(d, proj);
    }
    public getLinkTextPosX(d: Activity, proj: Project): number {
        return this.props.getLinkTextPosX(d, proj);
    }
    public getLowerLinkTextYPos(d: Activity, proj: Project): number {
        return this.props.getLowerLinkTextYPos(d, proj);
    }
    public getLowerLinkTextXPos(d: Activity, proj: Project): number {
        return this.props.getLowerLinkTextXPos(d, proj);
    }
    public getActivityFontSize(d: Activity, proj: Project): string {
        return this.props.getActivityFontSize(d, proj);
    }
    public getLinkText(d: Activity, proj: Project): string {
        return this.props.getLinkText(d, proj);
    }
    public getLinkEndMarker(d: Activity, proj: Project): string {
        return this.props.getLinkEndMarker(d, proj);
    }
    public getLinkCss(d: Activity, proj: Project): string {
        return this.props.getLinkCss(d, proj);
    }
    public getNodeCss(d: Integration, proj: Project): string {
        return this.props.getNodeCss(d, proj);
    }
    public getLowerLinkText(d: Activity, proj: Project): string {
        return this.props.getLowerLinkText(d, proj);
    }
    public setMouseDownLink(d: Activity, ctrlKey: boolean, proj: Project): boolean {
        return this.events.setSelectedLinkState(d, ctrlKey, proj);
    }
    public onNodeGroupMouseUp(target: Integration, proj: Project): boolean {
        return this.events.joinNodesOrCreateArrow(target, proj);
    }
    public onNodeGroupMouseDown(d: Integration, ctrlDown: boolean, el: any, proj: Project) {
        return this.events.setNodeDownStates(d, ctrlDown, el, proj);
    }
    public onNodeMouseOver(d: Integration, el: any): void {
        this.events.setMouseOverNodeStates(d, el);
    }
    public onNodeMouseOut(d: Integration, el: any): void {
        this.events.clearMouseOverNodeStates(d, el);
    }
    public clearClassesAndHideLine(): void {
        return this.events.clearSelectionAndHideLine();
    }
    public splitUpNode(integration: Integration, proj: Project) {
        return this.events.splitUpNode(integration, proj);
    }
    public makeDummy(): void {
        return this.events.makeDummy();
    }
    public makeMilestone(proj: Project): void {
        return this.events.makeMilestone(proj);
    }
    public deselectNode(project: Project): void {
        return this.events.deselectNode(project);
    }
    public deselectActivity(project: Project): void {
        return this.events.deselectActivity(project);
    }
}
