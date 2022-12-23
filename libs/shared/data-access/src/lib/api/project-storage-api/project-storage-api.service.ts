import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import * as CONST from '../../constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ProjectStorageApiService {
    constructor(private serializer: ProjectSerializerService) {}

    public get(storageType: string): Project {
        let stored: any;
        if (storageType === CONST.LOCAL_STORAGE) {
            stored = localStorage.getItem(CONST.PROJECT_STORAGE_KEY);
        } else if (storageType === CONST.SESSION_STORAGE) {
            stored = sessionStorage.getItem(CONST.PROJECT_STORAGE_KEY);
        }
        return this.serializer.fromJson(stored);
    }
    public set(storageType: string, project: Project): void {
        const json = this.serializer.toJson(project);
        if (storageType === CONST.LOCAL_STORAGE) {
            localStorage.setItem(CONST.PROJECT_STORAGE_KEY, json);
        }
        if (storageType === CONST.SESSION_STORAGE) {
            sessionStorage.setItem(CONST.PROJECT_STORAGE_KEY, json);
        }
    }
}
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
