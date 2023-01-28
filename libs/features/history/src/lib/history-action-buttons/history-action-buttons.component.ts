import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
// import { ProjectManagerBase } from '@critical-pass/critical-charts';
// import { ProjectStoreBase } from '@critical-pass/critical-charts';
// import { ProjectSerializerService } from '@critical-pass/critical-charts';
// import { ActionButtonsComponent } from '../../profile/components/action-buttons/action-buttons.component';
// import { HistoryFileManagerService } from '@critical-pass/critical-charts';
// import { ProjectSanatizerService } from '../../services/utils/project-sanitizer/project-sanatizer.service';
// import { ChartKeys } from '@critical-pass/critical-charts';
// import { ProjectTreeNodeSerializerService, TreeNode } from '@critical-pass/critical-charts';
import { ToastrService } from 'ngx-toastr';
import { DASHBOARD_TOKEN, DashboardService, EVENT_SERVICE_TOKEN, EventService, ProjectStorageApiService, ProjectApiService, API_CONST } from '@critical-pass/shared/data-access';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { ProjectSanatizerService } from '@critical-pass/shared/project-utils';
import { HistoryFileManagerService } from '@critical-pass/shared/file-management';
import { TreeNode } from '@critical-pass/project/types';
import { CHART_KEYS } from '@critical-pass/charts';

@Component({
    selector: 'cp-history-action-buttons',
    templateUrl: './history-action-buttons.component.html',
    styleUrls: ['./history-action-buttons.component.scss'],
})
export class HistoryActionButtonsComponent extends ActionButtonsComponent {
    private history!: TreeNode[];
    constructor(
        router: Router,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        serializer: ProjectSerializerService,
        sanitizer: ProjectSanatizerService,
        toastr: ToastrService,
        private storageApi: ProjectStorageApiService,
        private projectApi: ProjectApiService,
        @Inject('HistoryFileManagerService') private fileManager: HistoryFileManagerService,
    ) {
        super(router, dashboard, eventService, serializer, sanitizer, toastr, storageApi, projectApi);
        this.eventService.get<TreeNode[]>(CHART_KEYS.HISTORY_ARRAY_KEY).subscribe(history => {
            this.history = history;
        });
    }

    public unstashTree() {
        this.showPeek = false;

        this.showPeek = false;
        try {
            const project = this.storageApi.get(API_CONST.LOCAL_STORAGE);
            if(project !== null) {
                this.dashboard.updateProject(project, false);
                // this.pManager.updateProject(this.id, project, false);
                const head = new ProjectTreeNodeSerializerService().head();
                head.data = project;
                this.pManager.getChannel(ChartKeys.loadTree).next([head]);
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
    public loadFile(files: FileList) {
        if (files.length > 0) {
            this.fileManager.import(files.item(0)).then(nodes => {
                const hfNode$ = this.pManager.getChannel(ChartKeys.loadTree);
                hfNode$.next(nodes);
            });
        }
    }
}
