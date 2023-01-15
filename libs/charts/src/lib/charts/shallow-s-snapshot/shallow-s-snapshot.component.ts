import { Component, ElementRef, inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { BehaviorSubject } from 'rxjs';
// import { Project } from '../../models/project/project';
// import { ShallowSSnapshotFactoryService } from './shallow-s-snapshot-factory/shallow-s-snapshot-factory.service';
import { ShallowSSnapshotUiService } from './shallow-s-snapshot-ui/shallow-s-snapshot-ui.service';
// import { ShallowSSnapshotUiService } from './shallow-s-snapshot-ui/shallow-s-snapshot-ui.service';

@Component({
    selector: 'cp-shallow-s-snapshot',
    template: `
        <div class="shallow-s-component-wrapper">
            <div #chart class="shallow-s-container"></div>
        </div>
    `,
    styleUrls: ['./shallow-s-snapshot.component.scss'],
    providers: [ShallowSSnapshotUiService], 
    encapsulation: ViewEncapsulation.None,
})
export class ShallowSSnapshotComponent implements OnInit {
    @Input() id!: number;
    @Input() width!: number;
    @Input() height!: number;
    @Input() project!: Project;
    @ViewChild('chart', { static: true }) chart!: ElementRef;
    private ui!: ShallowSSnapshotUiService;

    constructor(/*factory: ShallowSSnapshotFactoryService*/) {
        this.ui = inject(ShallowSSnapshotUiService);
        // this.ui = factory.ui;
    }

    public ngOnInit(): void {
        if (!this.project) {
            this.ui.init(this.width, this.height, this.id, this.chart.nativeElement);
        } else {
            this.ui.renderStatic(this.project, this.width, this.height, this.chart.nativeElement);
        }
    }

    public ngOnDestroy() {
        this.ui.destroy();
    }
}
