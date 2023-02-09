import { Injectable } from '@angular/core';
import { Activity, Project, Resource, Tag } from '@critical-pass/project/types';
// import { Activity } from '@critical-pass/critical-charts';
// import { Project } from '@critical-pass/critical-charts';
// import { Resource } from '@critical-pass/critical-charts';
import { PhaseFactoryService } from '../phase-factory/phase-factory.service';
import { ResourceFactoryService } from '../resource-factory/resource-factory.service';
import { RoleFactoryService } from '../role-factory/role-factory.service';
import { SelectShortcutsService } from '../select-shortcuts/select-shortcuts.service';


@Injectable({
  providedIn: 'root'
})
export class AssignFrameworkService {

  private _colorBy!: string;
  private _colorByResourceView: string;
  private _defaultColorTag;
  private _defaultColor;
  set colorBy(type: string) {
      this._colorBy = type;
  }
  get colorBy() {
      return this._colorBy;
  }
  set colorByResourceView(type: string) {
      this._colorByResourceView = type;
  }

  constructor(
      private selectShortcuts: SelectShortcutsService,
      private resourceFactory: ResourceFactoryService,
      private phaseFactory: PhaseFactoryService,
      private roleFactory: RoleFactoryService,
  ) {
      this._defaultColor = { color: null, backgroundcolor: null };
      this._defaultColorTag = { backgroundcolor: '#bbbbbb', color: 'white' };
      this._colorByResourceView = 'none';
  }

  public getColorClassForActivity(activity: Activity) {
      if (this._colorBy === 'resource') {
          if (activity.assign.resources.length > 0) {
              const firstResource = activity.assign.resources[0];
              return firstResource.color;
          }
      }
      if (this._colorBy === 'phase') {
          if (activity.assign.phases.length > 0) {
              const firstPhase = activity.assign.phases[0];
              return firstPhase.color;
          }
      }
      return this._defaultColor;
  }

  public getColorClassForResource(resource: Resource) {
      if (this._colorByResourceView === 'role') {
          if (resource.assign.roles.length > 0) {
              const firstRole = resource.assign.roles[0];
              return firstRole.color;
          }
      } else if (this._colorByResourceView === 'phase') {
          if (resource.assign.phases.length > 0) {
              const firstPhase = resource.assign.phases[0];
              return firstPhase.color;
          }
      }
      return this._defaultColor;
  }

  public selectTagResource(project: Project, tag: any, type: string, tags: any[]) {
      const switchThis = this._colorByResourceView === type || this._colorByResourceView === 'none';
      if (type === 'role') {
          this._colorByResourceView = 'role';
      } else if (type === 'phase') {
          this._colorByResourceView = 'phase';
      }
      if (switchThis) {
          tag.view.isSelected = !tag.view.isSelected;
      } else {
          for (const t of tags) {
              t.view.isSelected = false;
          }
          tag.view.isSelected = true;
          this.deselectAll(project);
      }
  }

  getTagColor(t: Tag) {}

  public selectTag(project: Project, tag: any, type: string, tags: any[]) {
      const switchThis = this._colorBy === type || this._colorBy === 'none';
      if (type === 'resource') {
          this._colorBy = 'resource';
      } else if (type === 'phase') {
          this._colorBy = 'phase';
      }
      if (!switchThis)  {
          for (const t of tags) {
              t.view.isSelected = false;
          }
          tag.view.isSelected = true;
          this.deselectAll(project);
      }
      tag.view.isSelected = !tag.view.isSelected;
  }

  public selectResourceTag(project: Project, tag: any, type: string, tags: any[]) {
      const switchThis = this._colorByResourceView === type || this._colorByResourceView === 'none';
      if (type === 'role') {
          this._colorByResourceView = 'role';
      } else if (type === 'phase') {
          this._colorByResourceView = 'phase';
      }
      if (switchThis) {
          tag.view.isSelected = !tag.view.isSelected;
      } else {
          for (const t of tags) {
              t.view.isSelected = false;
          }
          tag.view.isSelected = true;
          this.deselectAll(project);
      }
  }

  public assignTagsToActivities(type: string, project: Project) {
      if (type === 'resources') {
          this._colorBy = 'resource';
      } else if (type === 'phases') {
          this._colorBy = 'phase';
      }
      if (type === 'resources') {
          const resources = project.resources.filter(r => r.view.isSelected);
          const activities = project.activities.filter(a => a.assign.isSelected);
          for (const activity of activities) {
              for (const resource of resources) {
                  const dup = activity.assign.resources.find(r => r.id === resource.id + '');
                  if (dup === undefined) {
                      const summary = this.resourceFactory.getSummary(resource);
                      activity.assign.resources.push(summary);
                  }
              }
          }
          // this.renderService.commitChange(project);
      } else if (type === 'phases') {
          const phases = project.phases.filter(p => p.view.isSelected);
          const activities = project.activities.filter(a => a.assign.isSelected);
          for (const activity of activities) {
              for (const phase of phases) {
                  const dup = activity.assign.phases.find(p => p.id === phase.id);
                  if (dup === undefined) {
                      const summary = this.phaseFactory.getSummary(phase);
                      activity.assign.phases.push(summary);
                  }
              }
          }
      }
      this.deselectAll(project);
  }

  public assignTagsToResources(type: string, project: Project) {
      if (type === 'roles') {
          this._colorByResourceView = 'role';
      } else if (type === 'phases') {
          this._colorByResourceView = 'phase';
      }
      if (type === 'roles') {
          const roles = project.roles.filter(r => r.view.isSelected);
          const resources = project.resources.filter(r => r.assign.isSelected);
          for (const resource of resources) {
              for (const role of roles) {
                  const dup = resource.assign.roles.find(r => r.id === role.id);
                  if (dup === undefined) {
                      const summary = this.roleFactory.getSummary(role);
                      resource.assign.roles.push(summary);
                  }
              }
          }
      } else if (type === 'phases') {
          const phases = project.phases.filter(p => p.view.isSelected);
          const resources = project.resources.filter(r => r.assign.isSelected);
          for (const resource of resources) {
              for (const phase of phases) {
                  const dup = resource.assign.phases.find(p => p.id === phase.id);
                  if (dup === undefined) {
                      const summary = this.phaseFactory.getSummary(phase);
                      resource.assign.phases.push(summary);
                  }
              }
          }
      }
      this.deselectAllResources(project);
  }

  public removeTags(project: Project, tagType: string, baseObjType: string) {
      if (baseObjType === 'activities') {
          if (tagType === 'resources') {
              this._colorBy = 'resource';
          } else if (tagType === 'phases') {
              this._colorBy = 'phase';
          }
          if (tagType === 'resources') {
              const activities = project.activities.filter(a => a.assign.isSelected);
              for (const activity of activities) {
                  activity.assign.resources = [];
              }
          } else if (tagType === 'phases') {
              const activities = project.activities.filter(a => a.assign.isSelected);
              for (const activity of activities) {
                  activity.assign.phases = [];
              }
          }
      }
      if (baseObjType === 'resources') {
          if (tagType === 'roles') {
              this._colorByResourceView = 'role';
          } else if (tagType === 'phases') {
              this._colorByResourceView = 'phase';
          }
          if (tagType === 'roles') {
              const resources = project.resources.filter(a => a.assign.isSelected);
              for (const resource of resources) {
                  resource.assign.roles = [];
              }
          } else if (tagType === 'phases') {
              const resources = project.resources.filter(a => a.assign.isSelected);
              for (const resource of resources) {
                  resource.assign.phases = [];
              }
          }
      }

      this.deselectAll(project);
  }
  public getColor(tag: any, type: string) {
      if (this._colorBy === 'resource' && type === 'resource' && tag.view.isSelected) {
          return tag.view.color;
      }
      if (this._colorBy === 'phase' && type === 'phase' && tag.view.isSelected) {
          return tag.view.color;
      }
      return this._defaultColorTag;
  }
  public getColorResource(tag: any, type: string) {
      if (this._colorByResourceView === 'role' && type === 'role' && tag.view.isSelected) {
          return tag.view.color;
      }
      if (this._colorByResourceView === 'phase' && type === 'phase' && tag.view.isSelected) {
          return tag.view.color;
      }
      return this._defaultColorTag;
  }
  public deselectAll(project: Project) {
      project.activities.forEach(a => (a.assign.isSelected = false));
      project.resources.forEach(r => (r.view.isSelected = false));
      project.phases.forEach(p => (p.view.isSelected = false));
  }
  public deselectAllResources(project: Project) {
      project.resources.forEach(a => (a.assign.isSelected = false));
      project.roles.forEach(r => (r.view.isSelected = false));
      project.phases.forEach(p => (p.view.isSelected = false));
  }

  public itemClicked(activity: Activity, index: number, project: Project) {
      return this.selectShortcuts.itemClicked(activity, index, project);
  }
  public resourceClicked(resource: Resource, index: number,  project: Project) {
      return this.selectShortcuts.resourceClicked(resource, index, project);
  }
  public keyUp(keyCode: number) {
      this.selectShortcuts.keyUp(keyCode);
  }
  public keyDown(keyCode: number) {
      this.selectShortcuts.keyDown(keyCode);
  }
  public selectAll(project: Project, type: string) {
      if (type === 'resources') {
          this._colorBy = 'resource';
          for (const resource of project.resources) {
              resource.view.isSelected = true;
          }
      }

      if (type === 'phases') {
          this._colorBy = 'phase';
          for (const phase of project.phases) {
              phase.view.isSelected = true;
          }
      }
  }
  public selectNone(project: Project, type: string) {
      if (type === 'resources') {
          this._colorBy = 'resource';
          for (const resource of project.resources) {
              resource.view.isSelected = false;
          }
      }
      if (type === 'phases') {
          this._colorBy = 'phase';
          for (const phase of project.phases) {
              phase.view.isSelected = false;
          }
      }
  }

  public unselect(project: Project, type: string) {
      if (type === 'resources') {
          const selected = project.activities.filter(a => a.assign.isSelected);
          for (const activity of selected) {
              activity.assign.resources = [];
          }
      } else if (type === 'phases') {
          const selected = project.activities.filter(a => a.assign.isSelected);
          for (const activity of selected) {
              activity.assign.phases = [];
          }
      }
  }
}
