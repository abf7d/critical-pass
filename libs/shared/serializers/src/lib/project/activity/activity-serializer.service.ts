import { Injectable } from '@angular/core';
import { Activity } from '../../../../models/project/activity/activity';
import { ProcessedSerializerService } from './processed/processed-serializer.service';
import { ChartSerializerService } from './chart/chart-serializer.service';
import { SubprojectSerializerService } from './subproject/subproject-serializer.service';
import { RiskSerializerService } from './risk/risk-serializer.service';
import { ActivityErrorSerializerService } from './activity-error/activity-error-serializer.service';
import { ActivityProfileSerializerService } from './profile/profile-serializer.service';
import { AssignResourcesSerializerService } from './assign-resources/assign-resources-serializer.service';
import { Serializer } from '../../serializer';

@Injectable({
    providedIn: 'root',
})
export class ActivitySerializerService implements Serializer<Activity> {
    fromJson(json: any = null): Activity {
        json = json ?? {};
        const obj: Activity = {
            processInfo: new ProcessedSerializerService().fromJson(json.processInfo),
            chartInfo: new ChartSerializerService().fromJson(json.chartInfo),
            subProject: new SubprojectSerializerService().fromJson(json.subProject),
            risk: new RiskSerializerService().fromJson(json.risk),
            errors: new ActivityErrorSerializerService().fromJson(),
            profile: new ActivityProfileSerializerService().fromJson(json.profile),
            assign: new AssignResourcesSerializerService().fromJson(json.assign),
        };
        return obj;
    }
    new(id: number, name: string, sourceId: number, targetId: number, risk: number, duration: number): Activity{
        const activity = this.fromJson();
        activity.profile.id = id;
        activity.profile.name = name;
        activity.chartInfo.source_id = sourceId;
        activity.chartInfo.target_id = targetId;
        activity.chartInfo.risk - risk;
        activity.profile.duration = duration;
        activity.assign.phases = [];
        activity.assign.resources =[];
        return activity;
    }
    toJson(obj: Activity): any {}
}
