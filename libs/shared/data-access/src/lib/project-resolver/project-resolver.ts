import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { ActivatedRouteSnapshot } from '@angular/router';
// import { ProjectStoreService } from '../../features/projects/services/api/project-store/project-store.service';
import { first, tap } from 'rxjs/operators';
// import * as Keys from '../constants/keys';
import { of } from 'rxjs';
import { ProjectApiService } from '../..';
import * as CONST from '../constants/constants';
import { ProjectStorageApiService } from '../api/project-storage-api/project-storage-api.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { NodeConnectorService } from '@critical-pass/project/processor';

@Injectable({
    providedIn: 'root',
})
export class ProjectResolver implements Resolve<any> {
    constructor(
        private dashboard: DashboardService,
        private projectApi: ProjectApiService,
        private storageApi: ProjectStorageApiService,
        private nodeConnector: NodeConnectorService,
    ) {}

    resolve(route: ActivatedRouteSnapshot) {
        if (+route.params['id'] === CONST.IMPORT_ROUTE_PARAM_ID) {
            const imported = this.storageApi.get(CONST.SESSION_STORAGE); //this.projStore.tempUnstore();
            const bs = this.dashboard.activeProject$; //this.projStore.get(CONST.IMPORT_ROUTE_PARAM_ID);
            if (imported !== null) bs.next(imported);
            return bs.pipe(first());
            // returnbs.pipe(first());
            // return of(imported);
        } else {
            return this.projectApi.get(route.params['id']).pipe(
                tap(project => {
                    this.nodeConnector.connectArrowsToNodes(project);
                    this.dashboard.activeProject$.next(project);
                }),
                first(),
            ); //this.projStore.load(route.params.id).pipe(first());
        }
    }
}

//tokens need to be in shared library along with configService
// shared utils? what should be the name of the library
