import { Injectable } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Project } from '../../../../../models/project/project';
import { Header, ImportData, Mapping } from '../../../../../models/file-manager/import-data'; 
import { ActivitySerializerService } from '../../../../serializers/project/activity/activity-serializer.service';
import { IntegrationSerializerService } from '../../../../serializers/project/integration/integration-serializer/integration-serializer.service';
import { ProjectSerializerService } from '../../../../serializers/project/project-serializer.service';


@Injectable({
  providedIn: 'root'
})
export class ImportMapperService {

  constructor() { }

  public mapFromSheet(columnDefs: ColDef[], rowData: ImportData, headerMapping: Header[]): Project {
    const project = new ProjectSerializerService().fromJson();
    const names = headerMapping.map(c => c.name.toLowerCase());
    const matchingCols =  columnDefs.filter(c => names.indexOf(c.headerName.toLowerCase()) > -1);
    const actSerializer = new ActivitySerializerService();
    project.activities = rowData.map(row => {
        const activity = actSerializer.fromJson();
        matchingCols.forEach((c, i) => {
            const header = headerMapping.find(x => x.name.toLowerCase() == c.headerName.toLowerCase());
            if (header) {
                activity.profile[header.activityProp] = row[c.field] ?? null;
            }
        });
        return activity;
    });
    this.generateNodes(project);
    return project;
}

public generateNodes(project: Project) {
    let id = 0;
    const intFactory = new IntegrationSerializerService();
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
