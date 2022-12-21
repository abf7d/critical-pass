import { Injectable } from '@angular/core';
import { SubProject } from '../../../../../models/project/activity/subproject';
import { Serializer } from '../../../serializer';

@Injectable({
    providedIn: 'root',
})
export class SubprojectSerializerService implements Serializer<SubProject> {
    fromJson(json: any = null): SubProject {
        json = json ?? {};
        const obj: SubProject = {
            graphId: json.graphId ?? null,
            subGraphId: json.subGraphId ?? -1,
            subGraphLoaded: json.subGraphLoaded ?? null,
            isParent: json.isParent ?? false,
        };
        return obj;
    }
    toJson(obj: SubProject): any {}
}
