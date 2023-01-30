import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/types';
import { ActivitySerializerService, IntegrationSerializerService, ProjectSerializerService } from '@critical-pass/shared/serializers';
import { ColDef } from 'ag-grid-community';
import { Header, ImportData } from '../../constants';

@Injectable({
    providedIn: 'root',
})
export class ImportMapperService {
    constructor(private projectSerializer: ProjectSerializerService, private actSerializer: ActivitySerializerService, private intSerializer: IntegrationSerializerService) {}

    public mapFromSheet(columnDefs: ColDef[], rowData: ImportData, headerMapping: Header[]): Project {
        const project = this.projectSerializer.fromJson();
        const names = headerMapping.map(c => c.name.toLowerCase());
        const matchingCols = columnDefs.filter(c => names.indexOf(c.headerName!.toLowerCase()) > -1);
        const actSerializer = this.actSerializer    ;
        project.activities = rowData.map(row => {
            const activity = actSerializer.fromJson();
            matchingCols.forEach((c, i) => {
                const header = headerMapping.find(x => x.name.toLowerCase() == c.headerName!.toLowerCase());
                if (header) {
                    (activity.profile as any)[header.activityProp] = (row as any)[c.field!] ?? null;
                }
            });
            return activity;
        });
        this.generateNodes(project);
        return project;
    }

    public generateNodes(project: Project) {
        let id = 0;
        const intFactory = this.intSerializer;
        project.activities.forEach((a, i) => {
            a.chartInfo.source_id = ++id;
            const source = intFactory.fromJson({ id, name: id });

            a.chartInfo.target_id = ++id;
            const target = intFactory.fromJson({ id, name: id });

            const div = Math.floor(i / 20);
            const rem = i % 20;

            source.x = 50 + 120 * div;
            source.y = 40 * (rem + 1);
            target.x = 120 + 120 * div;
            target.y = 40 * (rem + 1);

            project.integrations.push(source);
            project.integrations.push(target);
        });
    }
}
