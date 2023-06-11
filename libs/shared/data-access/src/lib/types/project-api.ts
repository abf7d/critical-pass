import { Project } from "@critical-pass/project/types";
import { Observable } from "rxjs";
import { ProjectLibrary } from "./project-library";

export interface ProjectApi {
    get(id: number): Observable<Project>;
    list(page: number, pageSize: number): Observable<ProjectLibrary>;
    post(project: Project): Observable<Project>;
    delete(id: number): Observable<any>;
}