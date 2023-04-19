// import { Activity, Integration } from '@critical-pass/project/types';
// import { Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { Activity, Integration } from '@critical-pass/project/types';
import { Subject } from 'rxjs';

// export interface ArrowState {
//     mainG: any;
//     lassoG: any;
//     svg: any;
//     nodes: any;
//     drag_line: any;
//     blockDelete: boolean;
//     selected_node: Integration | null;
//     last_selected_node: Integration | null;
//     activity_created: Subject<boolean> | null;
//     selected_link: Activity | null;
//     links: any;
//     mousedown_node: Integration | null;
//     drag_node: any;
//     mouseover_node: { d: Integration; el: any } | null;
//     mouseup_node: Integration | null;
//     mousedown_link: Activity | null;
//     ctrl_down: boolean;
//     lastKeyDown: number | null;
//     macMetaDown: boolean;
//     allowDeletes: boolean;
// }

// export class ArrowStateFactory {
//     create(): ArrowState {
//         return {
//             mainG: null,
//             lassoG: null,
//             svg: null,
//             drag_line: null,
//             selected_node: null,
//             nodes: null,
//             blockDelete: false,
//             activity_created: null,
//             selected_link: null,
//             links: null,
//             mousedown_node: null,
//             drag_node: null,
//             mouseover_node: null,
//             mouseup_node: null,
//             mousedown_link: null,
//             ctrl_down: false,
//             lastKeyDown: null,
//             macMetaDown: false,
//             last_selected_node: null,
//             allowDeletes: true,
//         };
//     }
// }
@Injectable({
    providedIn: 'root',
})
export class ArrowStateService {
    mainG: any;
    lassoG: any;
    svg: any;
    nodes: any;
    drag_line: any;
    blockDelete: boolean = false;
    selected_node: Integration | null = null;
    last_selected_node: Integration | null = null;
    activity_created: Subject<boolean> | null = null;
    selected_link: Activity | null = null;
    links: any = null;
    mousedown_node: Integration | null = null;
    drag_node: any = null;
    mouseover_node: { d: Integration; el: any } | null = null;
    mouseup_node: Integration | null = null;
    mousedown_link: Activity | null = null;
    ctrl_down: boolean = false;
    lastKeyDown: number | null = null;
    macMetaDown: boolean = false;
    allowDeletes: boolean = true;

    // Moved these values to this service, need to initialize it in arrowUi's init fn
    width: number | null = null;
    height: number | null = null;
    prevProjId: number | null = null;
    // TODO: st.arrowRisk and st.nodeRisk should not be passed into controller, they are on state service which isinjected
    nodeRisk: Map<number, number> = new Map<number, number>();
    arrowRisk: Map<number, number> = new Map<number, number>();
    // dashboard is apart of arrow's stateso maybe set here?
    // do I add project here so it will be set in state for all services that consume the state service?
    // project: Project | null = null;
    //TODO!!!!!!!!!!!!!! first implement this stuff and test loading profile and sub project. See if peices of state need to be cleared
    // use providers tied to component for these services too. NEED TO CLEAR STATE ON NEW PROJECT OR DIFFERENT ID?
    constructor() {}
}
