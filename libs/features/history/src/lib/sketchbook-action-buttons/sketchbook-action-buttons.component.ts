import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectManagerBase } from '@critical-pass/critical-charts';
import { ProjectStoreBase } from '@critical-pass/critical-charts';
import { ProjectSerializerService } from '@critical-pass/critical-charts';
import { ActionButtonsComponent } from '../../profile/components/action-buttons/action-buttons.component';
import { HistoryFileManagerService } from '@critical-pass/critical-charts';
import { ProjectSanatizerService } from '../../services/utils/project-sanitizer/project-sanatizer.service';
import { ChartKeys } from '@critical-pass/critical-charts';
import { ProjectTreeNodeSerializerService, TreeNode } from '@critical-pass/critical-charts';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'cp-sketchbook-action-buttons',
    templateUrl: './sketchbook-action-buttons.component.html',
    styleUrls: ['./sketchbook-action-buttons.component.scss'],
})
export class SketchbookActionButtonsComponent extends ActionButtonsComponent {
    private history: TreeNode[];
    constructor(
        router: Router,
        @Inject('ProjectManagerBase') pManager: ProjectManagerBase,
        @Inject('ProjectStoreBase') store: ProjectStoreBase,
        serializer: ProjectSerializerService,
        sanitizer: ProjectSanatizerService,
        toastr: ToastrService,
        @Inject('HistoryFileManagerService') private fileManager: HistoryFileManagerService,
    ) {
        super(router, pManager, store, serializer, sanitizer, toastr);
        this.pManager.getChannel(ChartKeys.historyArray).subscribe(history => {
            this.history = history;
        });
    }

    public unstashTree() {
        this.showPeek = false;

        this.showPeek = false;
        try {
            const project = this.pManager.unstash();
            this.pManager.updateProject(this.id, project, false);
            const head = new ProjectTreeNodeSerializerService().head();
            head.data = project;
            this.pManager.getChannel(ChartKeys.loadTree).next([head]);
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
