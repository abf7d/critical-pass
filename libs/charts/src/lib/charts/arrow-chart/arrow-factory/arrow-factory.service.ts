// import { Inject, Injectable, NgZone } from '@angular/core';
// import { ProjectManagerBase } from '../../../models/base/project-manager-base';
// import { ArrowChartUIService } from '../arrow-chart-ui/arrow-chart-ui.service';
// import { LassoToolService } from '../lasso-tool/lasso-tool.service';
// import { ArrowControllerService } from '../utils/arrow-controller.service';

// @Injectable({
//     providedIn: 'root',
// })
// export class ArrowFactoryService {
//     constructor(
//         @Inject('ProjectManagerBase') private pManager: ProjectManagerBase,
//         private ngZone: NgZone,
//         private lassoTool: LassoToolService,
//         private aManager: ArrowControllerService,
//     ) {}

//     get ui() {
//         return new ArrowChartUIService(this.pManager, this.ngZone, this.lassoTool, this.aManager);
//     }
// }
