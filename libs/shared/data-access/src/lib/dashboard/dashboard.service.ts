import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '@critical-pass/project/models';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    constructor(public projSerializer: ProjectSerializerService) {
        const emptyProj = projSerializer.fromJson();
        this.activeProject = new BehaviorSubject<Project>(emptyProj);
    }
    public activeProject: BehaviorSubject<Project>;
    public library: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
    public history: Project[] = [];
    public updateProject(project: Project) {
        // compile project first
        this.activeProject.next(project);
    }
}
