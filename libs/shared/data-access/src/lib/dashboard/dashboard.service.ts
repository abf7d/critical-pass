import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '@critical-pass/project/models';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { ProjectCompilerService } from '@critical-pass/project/processor';
@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    constructor(public projSerializer: ProjectSerializerService, public compiler: ProjectCompilerService) {
        const emptyProj = projSerializer.fromJson();
        this._activeProject = new BehaviorSubject<Project>(emptyProj);
    }
    private _activeProject: BehaviorSubject<Project>;
    private _library: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
    private _history: Project[] = [];
    private _cache: Map<number, Project> = new Map<number, Project>();
    get activeProject$(): BehaviorSubject<Project> {
        return this._activeProject;
    }
    get library(): BehaviorSubject<Project[]> {
        return this._library;
    }
    get history(): Project[] {
        return this._history;
    }
    get cache(): Map<number, Project> {
        return this._cache;
    }
    // public cacheProject(project: Project) {
    //     this._cache.set(project.profile.id, project);
    // }
    public updateProject(project: Project) {
        this.compiler.compile(project);
        this._cache.set(project.profile.id, project);
        this._activeProject.next(project);
    }
}
/*
 private history = {
    past: [] as State[],
    future: [] as State[],
        node.settings = p.settings;
      }
    });
    this.emit();
  }

  private emit() {
    // very simple implementation of state diff check
    // TODO: implement a more sophisticated state diff check
    const oldState = this.state$$.getValue();
    if (JSON.stringify(oldState) !== JSON.stringify(this.inState)) {
      this.state$$.next(this.inState);
      this.history.past.push(oldState);
      this.history.future = [];
    }
  }
    public undo() {
    const oldState = this.history.past.pop();
    if (oldState) {
      this.inState = oldState;
      this.state$$.next(this.inState);
      this.history.future.push(this.state$$.getValue());
    }
  }

  public redo() {
    const newState = this.history.future.pop();
    if (newState) {
      this.inState = newState;
      this.state$$.next(this.inState);
      this.history.past.push(this.state$$.getValue());
    }
  }
  */
