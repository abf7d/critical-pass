import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, ViewEncapsulation, SimpleChanges, OnChanges, inject } from '@angular/core';
import { ArrowSnapshotUiService } from './arrow-snapshot-ui/arrow-snapshot-ui.service';
import { Project } from '@critical-pass/project/models';
@Component({
    selector: 'cp-arrow-snapshot',
    template: `<div #chart class="arrow-snapshot"></div>`,
    styleUrls: ['./arrow-snapshot.component.scss'],
    providers: [ArrowSnapshotUiService], 
    encapsulation: ViewEncapsulation.None,
})
export class ArrowSnapshotComponent implements OnInit, OnDestroy, OnChanges {
    @Input() id!: number;
    @Input() width!: number;
    @Input() height!: number;
    @Input() parentId!: string;
    @Input() project!: Project;
    @Input() slot!: string;
    @Input() refresh!: number;
    @ViewChild('chart', { static: true }) chart!: ElementRef;
    private ui!: ArrowSnapshotUiService;
    constructor() {
        this.ui = inject(ArrowSnapshotUiService);
    }

    public ngOnInit(): void {
        if (!this.project) {
            this.ui.init(this.width, this.height, this.id, this.parentId, this.chart.nativeElement, this.slot);
        } else {
            this.ui.renderStatic(this.project, this.width, this.height, this.chart.nativeElement);
        }
    }

    public ngOnDestroy() {
        this.ui.destroy();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['refresh']?.currentValue && this.project) {
            this.ui.renderStatic(this.project, this.width, this.height, this.chart.nativeElement, false);
        }
    }
}
