import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, OnDestroy, ViewEncapsulation, inject } from '@angular/core';
import { ProjectTreeStateService } from './project-tree-state/project-tree-state';
import { ProjectTreeUiService } from './project-tree-ui/project-tree-ui.service';
import { TreeOperationsService } from './tree-operations/tree-operations.service';

@Component({
    selector: 'cp-project-tree',
    template: ` <div class="node-tree">
        <div #chart class="project-tree"></div>
    </div>`,
    styleUrls: ['./project-tree.component.scss'],
    providers: [ProjectTreeUiService, ProjectTreeStateService, TreeOperationsService],
    host: {
        class: 'cp-project-tree',
    },
    encapsulation: ViewEncapsulation.None,
})
export class ProjectTreeComponent implements OnInit, OnDestroy {
    @Input() id!: number;
    @Input() width!: number;
    @Input() height!: number;
    @ViewChild('chart', { static: true }) chart!: ElementRef;
    private ui: ProjectTreeUiService;

    constructor() {
        this.ui = inject(ProjectTreeUiService);
    }

    public ngOnInit(): void {
        this.ui.init(this.width, this.height, this.id, this.chart.nativeElement);
    }

    public ngOnDestroy() {
        this.ui.destroy();
    }
}
