import { Injectable } from '@angular/core';
import { Integration, Project } from '../../../models';
import { ActivitySerializerService, IntegrationSerializerService, ProjectSerializerService } from '../../serializers/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectExtractorService {

  constructor(
    private nodeSerializer: IntegrationSerializerService,
    private projectSerializer: ProjectSerializerService,
    private activitySerializer: ActivitySerializerService,
  ) { }

  public extractSubProject(project: Project, minProjId: number): Project {
    if (project.profile.view.isSubProjSelected) {
        const selectedActivities = project.activities.filter(x => {
            return project.profile.view.lassoedLinks.indexOf(x.profile.id) > -1;
        });
        let selectedStart: Integration = null;
        let selectedEnd: Integration = null;
        let internalNodes = project.integrations.filter(x => {
            if (project.profile.view.lassoStart === x.id) {
                selectedStart = x;
            }
            if (project.profile.view.lassoEnd === x.id) {
                selectedEnd = x;
            }
            return project.profile.view.lassoedNodes.indexOf(x.id) > -1 && selectedStart?.id != x.id && selectedEnd?.id != x.id;
        });
        if (selectedEnd && selectedStart) {
            const newStart = this.nodeSerializer.fromJson(selectedStart); 
            const newEnd = this.nodeSerializer.fromJson(selectedEnd); 
            selectedActivities.forEach(a => {
              if(a.chartInfo.target_id === selectedStart.id) {
                a.chartInfo.target = newStart;
              }
              if(a.chartInfo.source_id === selectedStart.id) {
                a.chartInfo.source = newStart;
              }
              if(a.chartInfo.target_id === selectedEnd.id) {
                a.chartInfo.target = newEnd;
              }
              if(a.chartInfo.source_id === selectedEnd.id) {
                a.chartInfo.source = newEnd;
              }
            })

            project.activities = project.activities.filter(x => selectedActivities.indexOf(x) === -1);
            project.integrations = [...project.integrations.filter(x => internalNodes.indexOf(x) === -1)];
            internalNodes = internalNodes.map(n => this.nodeSerializer.fromJson(n))
            internalNodes.push(newStart, newEnd);
            const newSubProject = this.projectSerializer.fromJson();
            let newSubProjId = minProjId - 1; 
            if (newSubProjId >= -1) {
                newSubProjId = -2;
            }
            const subProjName = `Sub Project ${newSubProjId}`;
            newSubProject.profile.id = newSubProjId;
            newSubProject.profile.name = subProjName;
            newSubProject.activities = selectedActivities;
            newSubProject.integrations = [...internalNodes];
            
            const replacementActivity = this.activitySerializer.fromJson();
            const actId = Math.max(...project.activities.map(x => x.profile.id)) + 1;
            replacementActivity.profile.id = actId;
            replacementActivity.chartInfo.source_id = selectedStart.id;
            replacementActivity.chartInfo.target_id = selectedEnd.id;
            replacementActivity.subProject.graphId = newSubProjId;
            replacementActivity.subProject.subGraphId = newSubProjId;
            replacementActivity.profile.name = subProjName;
            project.activities.push(replacementActivity);
            project.profile.view.lassoStart = null;
            project.profile.view.lassoEnd = null;
            project.profile.view.lassoedLinks = [];
            project.profile.view.lassoedNodes = [];
            return newSubProject;
        }
    }
}
}
