import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/types';
import { ZametekApiService } from '@critical-pass/shared/data-access';
import { FileCompilerService, ProjectSanatizerService } from '@critical-pass/shared/project-utils';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ButtonEventsService {
    constructor(private zametekApi: ZametekApiService, private projectSanitizer: ProjectSanatizerService, private fCompiler: FileCompilerService) {}

    public compileMsProject(file: File): Observable<Project> {
        return this.zametekApi.compileMsProject(file).pipe(
            tap(project => {
                project && this.fCompiler.compileProjectFromFile(project);
                return project;
            }),
        );
    }

    public compileArrowGraph(project: Project): Observable<Project | null> {
        this.projectSanitizer.sanitizeNumbers(project);
        return this.zametekApi.compileArrowGraph(project).pipe(
            tap(project => {
                project && this.fCompiler.compileProjectFromFile(project);
                return project;
            }),
        );
    }
}
