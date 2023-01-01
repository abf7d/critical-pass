import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/critical-charts';
import { ProjectCompilerService } from '@critical-pass/critical-charts';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProjectCompilerApiService } from '../../../../services/api/project-compiler/project-compiler-api.service';
import { ProjectSanatizerService } from '../../../../services/utils/project-sanitizer/project-sanatizer.service';

@Injectable({
    providedIn: 'root',
})
export class ButtonEventsService {
    constructor(private compilerApi: ProjectCompilerApiService, private projectSanitizer: ProjectSanatizerService, private pCompiler: ProjectCompilerService) {}

    public compileMsProject(file: File): Observable<Project> {
        return this.compilerApi.compileMsProject(file).pipe(
            tap(project => {
                project && this.pCompiler.compileProjectFromFile(project);
                return project;
            }),
        );
    }

    public compileArrowGraph(project: Project): Observable<Project> {
        this.projectSanitizer.sanitizeNumbers(project);
        return this.compilerApi.compileArrowGraph(project).pipe(
            tap(project => {
                project && this.pCompiler.compileProjectFromFile(project);
                return project;
            }),
        );
    }
}
