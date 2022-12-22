import { Injectable } from '@angular/core';
import { Errors } from '@critical-pass/project/models';
import { Serializer } from '../../serializer';

@Injectable({
    providedIn: 'root',
})
export class ActivityErrorSerializerService implements Serializer<Errors> {
    fromJson(json: any = null): Errors {
        json = json || {};
        const obj: Errors = {
            showDivisibleBy5Error: json.showDivisibleBy5Error ?? false,
            showMondayStartError: json.showMondayStartError ?? false,
            showAbnormalError: json.showAbnormalError ?? false,
        };
        return json;
    }
    toJson(obj: Errors): any {}
}
