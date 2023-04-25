// import { Activity, Integration } from '@critical-pass/project/types';
// import { Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { Activity, Integration } from '@critical-pass/project/types';
import { Subject } from 'rxjs';

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

    width: number | null = null;
    height: number | null = null;
    prevProjId: number | null = null;
   
    nodeRisk: Map<number, number> = new Map<number, number>();
    arrowRisk: Map<number, number> = new Map<number, number>();
    constructor() {}
}
