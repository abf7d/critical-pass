import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { NodeConnectorService } from '@critical-pass/project/processor';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import * as CONST from '../../constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ProjectStorageApiService {
    constructor(private serializer: ProjectSerializerService, private nodeConnector: NodeConnectorService) {}

    public get(storageType: string): Project | null {
        let stored: any;
        if (storageType === CONST.LOCAL_STORAGE) {
            stored = localStorage.getItem(CONST.PROJECT_STORAGE_KEY);
        } else if (storageType === CONST.SESSION_STORAGE) {
            stored = sessionStorage.getItem(CONST.PROJECT_STORAGE_KEY);
        }
        if (stored === undefined) {
            return null;
        }
        const project = this.serializer.fromJson(JSON.parse(stored));
        this.nodeConnector.connectArrowsToNodes(project);
        return project;
    }
    public set(storageType: string, project: Project): void {
        const json = this.serializer.toJson(project);
        const projectStr = JSON.stringify(json);
        if (storageType === CONST.LOCAL_STORAGE) {
            localStorage.setItem(CONST.PROJECT_STORAGE_KEY, projectStr);
        }
        if (storageType === CONST.SESSION_STORAGE) {
            sessionStorage.setItem(CONST.PROJECT_STORAGE_KEY, projectStr);
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
