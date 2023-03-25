import { Injectable } from '@angular/core';
import { ProcessedSerializerService } from './processed/processed-serializer.service';
import { ChartSerializerService } from './chart/chart-serializer.service';
import { SubprojectSerializerService } from './subproject/subproject-serializer.service';
import { RiskSerializerService } from './risk/risk-serializer.service';
import { ActivityErrorSerializerService } from './activity-error/activity-error-serializer.service';
import { ActivityProfileSerializerService } from './profile/profile-serializer.service';
import { AssignResourcesSerializerService } from './assign-resources/assign-resources-serializer.service';
import { Activity } from '@critical-pass/project/types';
import { Serializer } from '../serializer';
import { ActivityTagSerializerService } from './tag/activity-tag-serializer.service';

@Injectable({
    providedIn: 'root',
})
export class ActivitySerializerService implements Serializer<Activity> {
    fromJson(json: any = null): Activity {
        json = json ?? {};
        const tagSerilizer = new ActivityTagSerializerService();
        const obj: Activity = {
            processInfo: new ProcessedSerializerService().fromJson(json.processInfo),
            chartInfo: new ChartSerializerService().fromJson(json.chartInfo),
            subProject: new SubprojectSerializerService().fromJson(json.subProject),
            risk: new RiskSerializerService().fromJson(json.risk),
            errors: new ActivityErrorSerializerService().fromJson(),
            profile: new ActivityProfileSerializerService().fromJson(json.profile),
            assign: new AssignResourcesSerializerService().fromJson(json.assign),
            tags: json?.tags?.map((x: any) => tagSerilizer.fromJson(x)),
        };
        return obj;
    }
    new(id: number, name: string, sourceId: number | null, targetId: number | null, risk: number, duration: number): Activity {
        const activity = this.fromJson();
        activity.profile.id = id;
        activity.profile.name = name;
        activity.chartInfo.source_id = sourceId ?? Infinity; // Infinity is a placeholder for milestone... milestone has no traget or source
        activity.chartInfo.target_id = targetId ?? Infinity; // Infinity is a placeholder for milestone... milestone has no traget or source
        activity.chartInfo.risk - risk;
        activity.profile.duration = duration;
        activity.assign.phases = [];
        activity.assign.resources = [];
        return activity;
    }
    toJson(obj: Activity): any {}
}
