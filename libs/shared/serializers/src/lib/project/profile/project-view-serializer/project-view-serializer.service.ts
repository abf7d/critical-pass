import { Injectable } from '@angular/core';
import { View } from '../../../../../models/project/profile/view';
import { Serializer } from '../../../serializer';

@Injectable({
    providedIn: 'root',
})
export class ProjectViewSerializerService implements Serializer<View> {
    fromJson(json: any): View {
        json = json || {};
        const obj: View = {
            displayText: json.displayText ?? 'name',
            showDummies: json.showDummies ?? true,
            showEftLft: json.showEftLft ?? 'none',
            showFloat: json.showFloat ?? true,
            createAsDummy: json.createAsDummy ?? false,
            drawActivityCurves: json.drawActivityCurves ?? false,
            markCompleted: json.markCompleted ?? false,
            selectedActivity: null,
            selectedIntegration: null,
            showActions: json.showActions ?? true,
            showOrphaned: json.showOrphaned ?? false,
            showStepChart: json.showStepChart ?? false,
            lowerArrowText: json.lowerArrowText ?? 'float',
            showOverrun: json.showOverrun ?? false,
            toggleZoom: json.toggleZoom ?? false,
            autoZoom: json.autoZoom ?? true,
            useStartDates: json.useStatrDates ?? false,
            lassoOn: false,
            lassoedLinks: [],
            lassoedNodes: [],
            isSubProjSelected: false,
            lassoStart: null,
            lassoEnd: null,
            selectedTagGroup: null
        };
        return obj;
    }
    toJson(obj: View): any {}
}
