import { Activity, Integration } from '@critical-pass/project/types';
import { Subject } from 'rxjs';

export interface ArrowState {
    mainG: any;
    lassoG: any;
    svg: any;
    nodes: any;
    drag_line: any;
    blockDelete: boolean;
    selected_node: Integration | null;
    last_selected_node: Integration | null;
    activity_created: Subject<boolean> | null;
    selected_link: Activity | null;
    links: any;
    mousedown_node: Integration | null;
    drag_node: any;
    mouseover_node: { d: Integration; el: any } | null;
    mouseup_node: Integration | null;
    mousedown_link: Activity | null;
    ctrl_down: boolean;
    lastKeyDown: number | null;
    macMetaDown: boolean;
    allowDeletes: boolean;
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
            allowDeletes: true,
        };
    }
}
