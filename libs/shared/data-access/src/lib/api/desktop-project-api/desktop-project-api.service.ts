import { Injectable } from '@angular/core';
import { environment } from '@critical-pass/shared/environments';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import urlJoin from 'url-join';
import { Project } from '@critical-pass/project/types';
import * as CONST from '../../constants/constants';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { ProjectApi } from '../../types/project-api';
import { ProjectLibrary } from '../../types/project-library';

@Injectable({
    providedIn: 'root',
})
export class DesktopProjectApiService implements ProjectApi {
    private baseUrl!: string;
    constructor(private httpClient: HttpClient, private serializer: ProjectSerializerService) {
        this.baseUrl = environment.criticalPathApi;
    }

    public get(id: number): Observable<Project> {
        return this.httpClient.get(urlJoin(this.baseUrl, CONST.PROJECT_ENDPOINT, id.toString())).pipe(map((data: any) => this.serializer.fromJson(data)));
    }
    public list(page: number, pageSize: number): Observable<ProjectLibrary> {
        console.log('desktop-project-api.service.ts: list()');
        return this.httpClient
            .get(urlJoin(this.baseUrl, CONST.LIBRARY_ENDPOINT, page.toString(), pageSize.toString()), {
                observe: 'response' as 'body',
            })
            .pipe(map((data: any) => this.serialize(data)));
    }

    public post(project: Project) {
        const body = JSON.stringify(project);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient
            .post<Project>(urlJoin(this.baseUrl, CONST.PROJECT_ENDPOINT), body, { headers })
            .pipe(map(data => this.serializer.fromJson(data)));
    }

    public delete(id: number) {
        return this.httpClient.delete(urlJoin(this.baseUrl, CONST.PROJECT_ENDPOINT, id.toString()));
    }

    private serialize(data: any): ProjectLibrary {
        const count = data.headers.get('x-total-count');
        const items = data.body.map((item: any) => this.serializer.fromJson(item));
        const list: ProjectLibrary = {
            items: items,
            totalCount: count,
        };
        return list;
    }
}
