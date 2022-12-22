import { Injectable } from '@angular/core';
import { SubProject } from '@critical-pass/project/models';
import { Serializer } from '../../serializer';

@Injectable({
    providedIn: 'root',
})
export class ProjectSubprojectSerializerService implements Serializer<SubProject> {
    public fromJson(json: any): SubProject {
        json = json || {};
        const obj: SubProject = {
            clearSelectedArrow: json.clearSelectedArrow ?? false,
            activityParentId: json.activityParentId ?? null,
            riskDepthCalc: json.riskDepthCalc ?? 'top-level',
            activityParentName: json.activityParentName ?? '',
            parentProject: json.parentProject ?? null,
        };
        return obj;
    }
    toJson(obj: SubProject): any {}
}
