import { Injectable } from '@angular/core';
import { Resource, ResourceSummary } from '@critical-pass/project/types';
import { ColorFactoryService, ResourceSerializerService, ResourceSummarySerializerService } from '@critical-pass/shared/serializers';
import * as CONST from '../../constants';
@Injectable({
    providedIn: 'root',
})
export class ResourceFactoryService {
    constructor(
        private resourceSerializer: ResourceSerializerService,
        private colorFactory: ColorFactoryService,
        private summarySerializer: ResourceSummarySerializerService,
    ) {}
    addResource(name: string, resourceList: Resource[]) {
        if (name === undefined || name === '') {
            return;
        }
        const resource = this.resourceSerializer.fromJson();
        resource.profile.name = name;
        const parts = name.split(' ');
        let initials = '';
        if (parts !== undefined) {
            initials = parts.reduce((total, single) => {
                return total + single[0];
            }, '');
        }

        resource.profile.initials = initials;
        const index = resourceList.length + 1;
        const newColor = this.colorFactory.getColor(CONST.RESOURCE_COLOR_SCHEME, index);
        resource.view.color = newColor;
        resource.id = -1 * index; // This is negative for all resources that have been created but not saved yet
        resourceList.push(resource);
    }

    getSummary(resource: Resource) {
        const summary = this.summarySerializer.fromJson();
        summary.color = resource.view.color;
        summary.id = resource.id;
        summary.initials = resource.profile.initials;
        summary.name = resource.profile.name;
        return summary;
    }
    getResourceFromSummary(summary: ResourceSummary, resourceList: Resource[]) {
        const resource = resourceList.find(r => r.id  === summary.id);
        return resource;
    }
}
