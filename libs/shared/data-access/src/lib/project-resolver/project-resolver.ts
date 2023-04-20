import { Inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { DASHBOARD_TOKEN, ProjectApiService } from '../..';
import * as CONST from '../constants/constants';
import { ProjectStorageApiService } from '../api/project-storage-api/project-storage-api.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { NodeConnectorService } from '@critical-pass/project/processor';

@Injectable({
    providedIn: 'root',
})
export class ProjectResolver implements Resolve<any> {
    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private projectApi: ProjectApiService,
        private storageApi: ProjectStorageApiService,
        private nodeConnector: NodeConnectorService,
    ) {}

    resolve(route: ActivatedRouteSnapshot) {
        this.dashboard.secondaryProject$.next(null);
        if (+route.params['id'] === CONST.IMPORT_ROUTE_PARAM_ID) {
            const imported = this.storageApi.get(CONST.SESSION_STORAGE);
            if (imported !== null) {
                imported.profile.view.autoZoom = true;
                this.dashboard.cleanSlateForNewPage(imported);
            }
            const bs = this.dashboard.activeProject$;
            return bs.pipe(first());
        } else {
            return this.projectApi.get(route.params['id']).pipe(
                tap(project => {
                    this.nodeConnector.connectArrowsToNodes(project);
                    this.dashboard.activeProject$.next(project);
                }),
                first(),
            );
        }
    }
}
