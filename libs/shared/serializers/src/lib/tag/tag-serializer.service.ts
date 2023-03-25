import { Injectable } from '@angular/core';
import { TagGroupOption } from '@critical-pass/project/types';

@Injectable({
    providedIn: 'root',
})
export class TagSerializerService {
    constructor() {}

    public fromJson(json: any): TagGroupOption {
        json = json ?? {};
        const tags = json?.tags?.map((x: any) => {
            return {
                name: x?.name ?? '',
                color: x?.color ?? '',
                backgroundcolor: x?.backgroundcolor ?? '',
            };
        });
        const obj: TagGroupOption = {
            name: json?.name ?? '',
            color: json?.color ?? '',
            backgroundcolor: json?.backgroundcolor ?? '',
            tags: tags,
        };
        return obj;
    }
}
