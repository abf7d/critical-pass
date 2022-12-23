import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { ActivatedRouteSnapshot } from '@angular/router';
import { ProjectStoreService } from '../../features/projects/services/api/project-store/project-store.service';
import { first } from 'rxjs/operators';
import * as Keys from '../constants/keys';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProjectResolver implements Resolve<any> {
    constructor(private projStore: ProjectStoreService) {}

    resolve(route: ActivatedRouteSnapshot) {
        if (+route.params.id === Keys.importIdRouteParam) {
            const imported = this.projStore.tempUnstore();
            const bs = this.projStore.get(Keys.importIdRouteParam);
            bs.next(imported);
            return bs.pipe(first());
            // returnbs.pipe(first());
            // return of(imported);
        } else {
            return this.projStore.load(route.params.id).pipe(first());
        }
    }
}

//tokens need to be in shared library along with configService
// shared utils? what should be the name of the library
