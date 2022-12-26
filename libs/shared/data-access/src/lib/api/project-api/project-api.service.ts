import { Injectable } from '@angular/core';
import { environment } from '@critical-pass/shared/environments';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import urlJoin from 'url-join';
import { Project } from '@critical-pass/project/models';
import * as CONST from '../../constants/constants';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';

@Injectable({
    providedIn: 'root',
})
export class ProjectApiService {
    private baseUrl!: string;
    constructor(private httpClient: HttpClient, private serializer: ProjectSerializerService) {
        console.log('criticalPathApi', environment.criticalPathApi);
        this.baseUrl = environment.criticalPathApi;
    }

    public get(id: number): Observable<Project> {
        return this.httpClient.get(urlJoin(this.baseUrl, CONST.PROJECT_ENDPOINT, id.toString())).pipe(map((data: any) => this.serializer.fromJson(data)));
    }
    public list(page: number, pageSize: number): Observable<ProjectLibrary> {
        return this.httpClient
            .get(urlJoin(this.baseUrl, CONST.LIBRARY_ENDPOINT, page.toString(), pageSize.toString()), {
                observe: 'response' as 'body',
            })
            .pipe(map((data: any) => this.convertData(data)));
    }

    private convertData(data: any): ProjectLibrary {
        const count = data.headers.get('x-total-count');
        const items = data.body.map((item: any) => this.serializer.fromJson(item));
        const list: ProjectLibrary = {
            items: items,
            totalCount: count,
        };
        return list;
    }
}

export interface ProjectLibrary {
    items: Project[];
    totalCount: number;
}

// import { Inject, Injectable } from '@angular/core';
// import { ResourceService } from '../resource-base/resource-api';
// import { Project } from '@critical-pass/critical-charts';
// import { HttpClient } from '@angular/common/http';
// import { ProjectSerializerService } from '@critical-pass/critical-charts';
// import { EventService } from '@critical-pass/critical-charts';
// import { ProjectStoreBase } from '@critical-pass/critical-charts';
// import * as Keys from '../../../../../core/constants/keys';
// import { Observable, Subject } from 'rxjs';
// import { ProjectCompilerService } from '@critical-pass/critical-charts';
// import { StorageService } from '../../utils/storage/storage.service';
// import { List } from '../../../../../core/models/list';
// import { PdConfig } from '../../../../../core/models/pd-app.config';
// @Injectable({
//     providedIn: 'root',
// })
// export class ProjectStoreService extends  ProjectStoreBase {
//     private api: ResourceService<Project>;
//     constructor(@Inject(Keys.APP_CONFIG) config: PdConfig, private eventService: EventService, httpClient: HttpClient, serializer: ProjectSerializerService,  private storage: StorageService,  private processor: ProjectCompilerService,) {
//         super();
//         this.api = new ResourceService<Project>(httpClient, config.criticalPathApi, Keys.projectEndpoint, Keys.libraryEndpoint, serializer);
//     }
//     private getId(id: number | string) {
//         return `p-${id}`;
//     }
//     public load(id: number): Subject<Project> {
//         const projBs = this.eventService.get<Project>(this.getId(id));
//         this.api.get(id).subscribe((project: Project) => {
//             this.processor.processProject(project);
//             project.profile.view.autoZoom = true;
//             projBs.next(project);
//         });
//         return projBs;
//     }
//     public get(id: number | string): Subject<Project>  {
//         return this.eventService.get<Project>(this.getId(id));
//     }

//     public post(project: Project) {
//         return this.api.post(project);
//     }

//     public delete(id: number) {
//         return this.api.delete(id);
//     }

//     public getProjects(page: number, pageSize: number): Observable<List<Project>> {
//         return this.api.list(page, pageSize);
//     }

//     public stash(project: Project) {
//         this.storage.local.set(Keys.cachedProjectStorage, project);
//     }

//     public unstash(): Project {
//         const project = this.storage.local.get(Keys.cachedProjectStorage);
//         this.processor.processProject(project);
//         project.profile.view.autoZoom = true;
//         return project;
//     }

//     public tempStore(project: Project): void {
//         this.storage.session.set(Keys.cachedProjectStorage, project);
//     }
//     public tempUnstore(): Project {
//         const project = this.storage.session.get(Keys.cachedProjectStorage);
//         this.processor.processProject(project);
//         project.profile.view.autoZoom = true;
//         return project
//     }
// }

// // 0) Refresh TOken!!!!
// // 0) Implement Event Service
// // 1) TODO: Implement ProjectStore (this file) from below. Extend ProjectStore in library, inject it using UseClass. Do I use a class with hard coded observables for charts and eventservice for everything else
// //    NOT TRUE: ProjectStore needs to be able to unsubscribe from all proj bs, so implement this as an eventservice that will iterate and unsubscribe on onDestroy
// // 2) TODO: write project models
// // 3) TODO: write a serializer that takes json and constructs a project (provide default values) maybe have a default object of empty and use lodash merge to generate object
// // 4) TODO Figure out what to do with library (a resource-api?), Build a cache service that can be used to load / save
// //      (but can be used to swap out for another service (say you wanted to cache on the backend instead of sessionstorgae))
// // when you call an api and get the data, you set the data in the event service then return the bs
// // ArrowDiagram.getChart =>
// // 1) store.getchart
// //    bs = eventService.get(id) // Do I need to clear cache?
// //    projectApi.get(chartId).subscribe( project => bs.next(project))
// //    return bs

// // Where to put the factories
// // The factories might be specific to application concerns like loading from local storage
// // Maybe saving and loading from / to localstorage should be apart of the library for people to use
// // Createing Activities or Phases or Nodes will need to be in the library
// // Have the factories here in the library, but have loading from local storage an application concern
// // It is IO, not graph functionalty
// // Factories will create default values so you can generate an empty proj or any component

// // load and save from session storage? => a serveice for this
// // parent project
// // libraries
