import { Component, ElementRef, inject, Input, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Project } from '@critical-pass/project/types';
import { BehaviorSubject } from 'rxjs';
import { Margin } from './stacked-resources-state/stacked-resources-state';
import { StackedResourcesUiService } from './stacked-resources-ui/stacked-resources-ui.service';

@Component({
    selector: 'cp-stacked-resources',
    template: ` <div class="stacked-resources-component-wrapper">
        <div #chart class="stacked-resources-container"></div>
    </div>`,
    styleUrls: ['./stacked-resources.component.scss'],
    providers: [StackedResourcesUiService],
    host: {
        class: 'cp-stacked-resources',
    },
    encapsulation: ViewEncapsulation.None,
})
export class StackedResourcesComponent implements OnInit {
    @ViewChild('chart', { static: true }) chart!: ElementRef;
    @Input() height!: number;
    @Input() width!: number;
    @Input() barWidth!: number;
    @Input() showAxes!: boolean;
    @Input() id!: number;
    @Input() margin!: Margin;
    @Input() project!: Project;
    private ui: StackedResourcesUiService;
    public isEmpty: BehaviorSubject<boolean>;

    constructor() {
        this.ui = inject(StackedResourcesUiService);
        this.isEmpty = new BehaviorSubject<boolean>(true);
    }

    public ngOnInit(): void {
        this.ui.setProjIsEmpty(this.isEmpty);
        if (!this.project) {
            this.ui.init(this.width, this.height, this.margin, this.showAxes, this.id, this.barWidth, this.chart.nativeElement);
        } else {
            this.ui.renderStatic(this.width, this.height, this.margin, this.showAxes, this.project, this.barWidth, this.chart.nativeElement);
        }
    }

    public ngOnDestroy() {
        this.ui.destroy();
    }
}
