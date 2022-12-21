import { Injectable } from '@angular/core';
import { ActivitySubProject } from '@critical-pass/project/models';
import { Serializer } from '../../serializer';

@Injectable({
    providedIn: 'root',
})
export class SubprojectSerializerService implements Serializer<ActivitySubProject> {
    fromJson(json: any = null): ActivitySubProject {
        json = json ?? {};
        const obj: ActivitySubProject = {
            graphId: json.graphId ?? null,
            subGraphId: json.subGraphId ?? -1,
            subGraphLoaded: json.subGraphLoaded ?? null,
            isParent: json.isParent ?? false,
        };
        return obj;
    }
    toJson(obj: ActivitySubProject): any {}
}
