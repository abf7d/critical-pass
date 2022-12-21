import { Injectable } from '@angular/core';
import { Processed } from '../../../../../models/project/activity/processed';
import { Serializer } from '../../../serializer';

@Injectable({
    providedIn: 'root',
})
export class ProcessedSerializerService implements Serializer<Processed> {
    fromJson(json: any = null): Processed {
        json = json || {};
        const obj: Processed = {
            onMainPath: json.onMainPath ?? false,
            editingDependencies: false,
            inDependencyBucket: false,
            showBucket: false,
            completed: json.completed ?? false,
        };
        return obj;
    }
    toJson(obj: Processed): any {}
}
