import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { map, Observable } from 'rxjs';
import { environment } from '@critical-pass/shared/environments';
import urlJoin from 'url-join';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import * as CONST from '../../constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ZametekApiService {
    constructor(private http: HttpClient, private projectSerializer: ProjectSerializerService /*, @Inject(Keys.APP_CONFIG) private config: PdConfig*/) {}

    public compileMsProject(file: File): Observable<Project> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http
            .post(urlJoin(environment.mappingApi, CONST.MS_PROJECT_COMPILE_ENDPOINT), formData)
            .pipe(map(x => new ProjectSerializerService().fromJson(x)));
    }

    public compileArrowGraph(project: Project): Observable<Project | null> {
        const body = JSON.stringify(project);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http
            .post(urlJoin(environment.mappingApi, CONST.BUILD_ARROW_GRAPH_ENDPOINT), body, {
                headers: headers,
            })
            .pipe(map(x => (!!x ? this.projectSerializer.fromJson(x) : null)));

    }
}
