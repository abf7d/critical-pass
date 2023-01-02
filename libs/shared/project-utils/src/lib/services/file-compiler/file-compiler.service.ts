import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { ActivitySorterService, NodeConnectorService, RiskCompilerService } from '@critical-pass/project/processor';
import { EndNodesLocatorService } from '../end-nodes-locator/end-nodes-locator.service';
import { NodeArrangerService } from '../node-arranger/node-arranger.service';

@Injectable({
    providedIn: 'root',
})
export class FileCompilerService {
    constructor(
        private nodeConstructor: NodeConnectorService,
        private riskCompiler: RiskCompilerService,
        private endNodesLocator: EndNodesLocatorService,
        private nodeArranger: NodeArrangerService,
        private activitySorter: ActivitySorterService,
    ) {}
    compileProjectFromFile(project: Project) {
        this.nodeConstructor.connectArrowsToNodes(project);
        this.endNodesLocator.setStartEndNodesFromLongestPath(project);
        this.riskCompiler.compileRiskProperties(project);
        this.nodeArranger.arrangeNodes(project);
        this.activitySorter.sortDummiesLast(project);
    }
}
