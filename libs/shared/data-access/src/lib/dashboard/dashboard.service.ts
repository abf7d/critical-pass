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
    get activeProject(): BehaviorSubject<Project> {
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
