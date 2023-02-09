// import { Inject, Injectable, NgZone } from '@angular/core';
// import { ProjectManagerBase } from '../../../models';
// import { ProjectCompilerApiBase } from '../../../models/base/project-compiler-base';
// import { CompletionNodeCalcService } from '../../../services/utils/completion-node-calc/completion-node-calc.service';
// import { ProjectCompilerService } from '../../../services/utils/project-compiler/project-compiler.service';
// import { TimeCostUiService } from '../time-cost-ui/time-cost-ui.service';

// @Injectable({
//     providedIn: 'root',
// })
// export class TimeCostFactoryService {
//     constructor(
//         @Inject('ProjectManagerBase') private pManager: ProjectManagerBase,
//         private completion: CompletionNodeCalcService,
//         private compilerApi: ProjectCompilerApiBase,
//         private compiler: ProjectCompilerService,
//     ) {}

//     get ui() {
//         return new TimeCostUiService(this.pManager, this.completion, this.compilerApi, this.compiler); // (this.pManager, this.ngZone, this.decompressor);
//     }
// }
