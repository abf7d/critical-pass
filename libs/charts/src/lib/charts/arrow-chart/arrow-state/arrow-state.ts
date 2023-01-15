import { Subject } from 'rxjs';
import { Activity } from '../../../models/project/activity/activity';
import { Integration } from '../../../models/project/integration/integration';

export interface ArrowState {
    mainG: any,
    lassoG: any,
    svg: any,
    nodes: any,
    drag_line: any,
    blockDelete: boolean
    selected_node: Integration,
    last_selected_node: Integration,
    activity_created: Subject<boolean>
    selected_link: Activity,
    links: any;
    mousedown_node: Integration
    drag_node: any;
    mouseover_node: {d: Integration, el: any}
    mouseup_node: Integration,
    mousedown_link: Activity,
    ctrl_down: boolean,
    lastKeyDown: number,
    macMetaDown: boolean,
    allowDeletes: boolean
}

export class ArrowStateFactory {
    create(): ArrowState {
        return {
            mainG: null,
            lassoG: null,
            svg: null,
            drag_line: null,
            selected_node: null,
            nodes: null,
            blockDelete: false,
            activity_created: null,
            selected_link: null,
            links: null,
            mousedown_node: null,
            drag_node: null,
            mouseover_node: null,
            mouseup_node: null,
            mousedown_link: null,
            ctrl_down: false,
            lastKeyDown: null,
            macMetaDown: false,
            last_selected_node: null,
            allowDeletes: true
        }
    }
}