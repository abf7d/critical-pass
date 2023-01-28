import { Injectable } from '@angular/core';
import { AssignResources } from '@critical-pass/project/types';
import { PhaseSummarySerializerService } from '../../phase/phase-serializer/phase-serializer.service';
import { ResourceSummarySerializerService } from '../../resource/resource-serializer/resource-serializer.service';
import { Serializer } from '../../serializer';

@Injectable({
    providedIn: 'root',
})
export class AssignResourcesSerializerService implements Serializer<AssignResources> {
    fromJson(json?: any): AssignResources {
        json = json || {};
        const resourceFactory = new ResourceSummarySerializerService();
        const phaseFactory = new PhaseSummarySerializerService();
        const obj: AssignResources = {
            isSelected: json?.isSelected ?? false,
            resources: json?.resources ? json.resources.map((r: any) => resourceFactory.fromJson(r)) : [],
            phases: json?.phases ? json.phases.map((p: any) => phaseFactory.fromJson(p)) : [],
            isStartBranch: json.isStartBranch ?? false,
            noDependencies: json.noDependencies ?? false,
            noGoto: json.noGoto ?? false,
        };
        return obj;
    }
    toJson(obj: AssignResources): any {}
}
