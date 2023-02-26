import { Injectable } from '@angular/core';
import { NodeConnectorService } from '../node-connector/node-connector.service';
// import { Project } from '../../../models/project/project';
import { DateUtilsService } from '../date-utils/date-utils.service';
import { DanglingArrowService } from '../dangling-arrow/dangling-arrow.service';
import { RiskCompilerService } from '../risk-compiler/risk-compiler.service';
import { CompletionCalcService } from '../completion-calc/completion-calc.service';
import { ActivityValidatorService } from '../activity-validator/activity-validator.service';
import { Project } from '@critical-pass/project/types';

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
}
