import { Injectable } from '@angular/core';
import { NodeConnectorService } from '../node-connector/node-connector.service';
// import { Project } from '../../../models/project/project';
import { DateUtilsService } from '../date-utils/date-utils.service';
import { DanglingArrowService } from '../dangling-arrow/dangling-arrow.service';
import { RiskCompilerService } from '../risk-compiler/risk-compiler.service';
import { CompletionCalcService } from '../completion-calc/completion-calc.service';
// import { ParentRiskRefreshService } from '../parent-risk-refresh/parent-risk-refresh.service';
// import { EndNodesLocatorService } from '../end-nodes-locator/end-nodes-locator.service';
// import { PcdAutogenService } from '../pcd-autogen/pcd-autogen.service';
// import { ActivityBuilder } from '../activity-builder/activity-builder';
// import { DependencyCrawlerService } from '../dependency-crawler/dependency-crawler.service';
// import { IdGeneratorService } from '../id-generator/id-generator.service';
// import { NodeArrangerService } from '../node-arranger/node-arranger.service';
import { ActivitySorterService } from '../activity-sorter/activity-sorter.service';
import { ActivityValidatorService } from '../activity-validator/activity-validator.service';
import { Project } from '@critical-pass/project/models';

@Injectable({
    providedIn: 'root',
})
export class ProjectCompilerService {
    constructor(
        private nodeConstructor: NodeConnectorService,
        private dateUtils: DateUtilsService,
        private projectUtils: DanglingArrowService,
        private riskCompiler: RiskCompilerService,
        private completionCalc: CompletionCalcService,
        // private parentRiskRefresh: ParentRiskRefreshService,
        // private endNodesLocator: EndNodesLocatorService,
        // private pcdAutogen: PcdAutogenService,
        // private activityBuilder: ActivityBuilder,
        // private dependencyCrawler: DependencyCrawlerService,
        // private idGenerator: IdGeneratorService,
        // private nodeArranger: NodeArrangerService,
        // private activitySorter: ActivitySorterService,
        private activityValidator: ActivityValidatorService,
    ) {}
    public compile(project: Project): void {
        this.nodeConstructor.connectArrowsToNodes(project);
        this.riskCompiler.compileRiskProperties(project);
        this.completionCalc.calculateCompleted(project);
        this.dateUtils.calculateEarliestFinishDate(project);
        this.dateUtils.setMaxPCDs(project);
        this.projectUtils.calculateDanglingActivities(project);
        this.activityValidator.validateActivities(project);
    }

    // public updateParentRisk(project: Project): void {
    //     this.riskCompiler.compileRiskProperties(project);
    //     this.dateUtils.calculateEarliestFinishDate(project);
    //     this.parentRiskRefresh.updateParentRisk(project);
    //     this.riskCompiler.compileRiskProperties(project.profile.parentProject);
    //     this.dateUtils.calculateEarliestFinishDate(project.profile.parentProject);
    // }

    // public compileProjectFromFile(project: Project) {
    //     this.nodeConstructor.connectArrowsToNodes(project);
    //     this.endNodesLocator.setStartEndNodesFromLongestPath(project);
    //     this.riskCompiler.compileRiskProperties(project);
    //     this.nodeArranger.arrangeNodes(project);
    //     this.activitySorter.sortDummiesLast(project);
    // }

    // public setStartEndNodes(project: Project): void {
    //     this.endNodesLocator.setStartEndNodesFromLongestPath(project);
    // }

    // public connectArrowsToNodes(project: Project): void {
    //     this.nodeConstructor.connectArrowsToNodes(project);
    // }

    // public autogeneratePcds(project: Project): void {
    //     this.pcdAutogen.autogeneratePcds(project);
    // }

    // public addActivity(project: Project): void {
    //     this.activityBuilder.addActivity(project);
    // }

    // public updateDependencyData(project: Project): void {
    //     this.dependencyCrawler.setDependencyDataFromGraph(project);
    // }

    // public resetIds(project: Project): void {
    //     this.idGenerator.resetIds(project);
    // }
}
