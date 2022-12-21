import { Injectable } from '@angular/core';
import { AssignResources } from '../../../../../models/project/activity/assign-resources';
import { Serializer } from '../../../serializer';
import { PhaseSummarySerializerService } from '../../phase/phase-serializer/phase-serializer.service';
import { ResourceSummarySerializerService } from '../../resource/resource-serializer/resource-serializer.service';

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
            resources: json?.resources ? json.resources.map(r => resourceFactory.fromJson(r)) : [],
            phases: json?.phases ? json.phases.map(p => phaseFactory.fromJson(p)) : [],
            isStartBranch: json.isStartBranch ?? false,
            noDependencies: json.noDependencies ?? false,
            noGoto: json.noGoto ?? false,
        };
        return obj;
    }
    toJson(obj: AssignResources): any {}
}
