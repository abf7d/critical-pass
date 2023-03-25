import { Injectable } from '@angular/core';
import { TagGroup } from '@critical-pass/project/types';

@Injectable({
    providedIn: 'root',
})
export class ActivityTagSerializerService {
    constructor() {}

    public fromJson(json: any): TagGroup {
        json = json ?? {};
        const tags = json?.tags?.map((x: any) => {
            return {
                name: x?.name ?? '',
                color: x?.color ?? '',
                backgroundcolor: x?.backgroundcolor ?? '',
            };
        });
        const obj: TagGroup = {
            name: json?.name ?? '',
            tags: tags,
        };
        return obj;
    }
}
