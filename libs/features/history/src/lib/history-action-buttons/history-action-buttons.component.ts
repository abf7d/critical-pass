import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
    DASHBOARD_TOKEN,
    DashboardService,
    EVENT_SERVICE_TOKEN,
    EventService,
    ProjectStorageApiService,
    ProjectApiService,
    API_CONST,
} from '@critical-pass/shared/data-access';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { ProjectSanatizerService } from '@critical-pass/shared/project-utils';
import { HistoryFileManagerService } from '@critical-pass/shared/file-management';
import { TreeNode } from '@critical-pass/project/types';
import { CHART_KEYS, ProjectTreeNodeSerializerService } from '@critical-pass/charts';
import { ActionButtonsComponent } from '@critical-pass/shared/components';

@Component({
    selector: 'cp-history-action-buttons',
    templateUrl: './history-action-buttons.component.html',
    styleUrls: ['./history-action-buttons.component.scss'],
})
export class HistoryActionButtonsComponent extends ActionButtonsComponent {
    private history!: TreeNode[];
    constructor(
        router: Router,
        @Inject(DASHBOARD_TOKEN) dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) eventService: EventService,
        serializer: ProjectSerializerService,
        sanitizer: ProjectSanatizerService,
        toastr: ToastrService,
        storageApi: ProjectStorageApiService,
        projectApi: ProjectApiService,
        @Inject('HistoryFileManagerService') private fileManager: HistoryFileManagerService,
        private treeNodeSerializer: ProjectTreeNodeSerializerService,
    ) {
        super(router, dashboard, eventService, serializer, sanitizer, toastr, storageApi, projectApi);
        eventService.get<TreeNode[]>(CHART_KEYS.HISTORY_ARRAY_KEY).subscribe(history => {
            this.history = history;
        });
    }

    public unstashTree() {
        this.showPeek = false;

        this.showPeek = false;
        try {
            const project = this.storageApi.get(API_CONST.LOCAL_STORAGE);
            if (project !== null) {
                this.dashboard.updateProject(project, false);
                const head = this.treeNodeSerializer.head();
                head.data = project;
                this.eventService.get(CHART_KEYS.LOAD_TREE_KEY).next([head]);
            }
        } catch (ex) {
            this.toastr.error('Unstash Chart', 'Error occured.');
            console.error(ex);
            return;
        }
        this.toastr.success('Unstash Chart', 'Success!');
    }

    public downloadHistory() {
        this.fileManager.export(this.history);
    }
    public loadFile(event: any) {
        const files = event.files as FileList;
        const firstFile = files.item(0);

        if (firstFile !== null && files.length > 0) {
            this.fileManager.import(firstFile).then(nodes => {
                this.eventService.get(CHART_KEYS.LOAD_TREE_KEY).next(nodes);
            });
        }
    }
}
