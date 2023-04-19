import { Component, OnInit, Input, ElementRef, ViewChild, ViewEncapsulation, OnDestroy, inject } from '@angular/core';
import { ArrowChartUIService } from './arrow-chart-ui/arrow-chart-ui.service';
import { BehaviorSubject, Subject } from 'rxjs';
import * as CONST from '../../constants/constants';
import { LassoToolService } from './arrow-chart-ui/lasso-tool/lasso-tool.service';
import { ArrowSvgZoomService } from './arrow-chart-ui/arrow-svg-zoom/arrow-svg-zoom.service';
import { EventBinderService } from './arrow-chart-ui/event-binder/event-binder.service';
import { ChartElFactory } from './arrow-chart-ui/chart-el-factory/chart-el-factory.service';
import { ArrowStateService } from './arrow-state/arrow-state';
import { ArrowControllerService } from './arrow-controller/arrow-controller.service';
import { EventHandlerService } from './arrow-controller/event-handler/event-handler.service';
import { ProjectElFactory } from './arrow-controller/project-el-factory/project-el-factory.service';
import { ElPositionerService } from './arrow-controller/el-positioner/el-positioner.service';
import { ArrowPropertyService } from './arrow-controller/arrow-property/arrow-property.service';

@Component({
    selector: 'cp-arrow-chart',
    templateUrl: './arrow-chart.component.html',
    styleUrls: ['./arrow-chart.component.scss'],
    providers: [
        ArrowChartUIService,
        ArrowControllerService,
        ArrowSvgZoomService,
        EventHandlerService,
        EventBinderService,
        ProjectElFactory,
        LassoToolService,
        ChartElFactory,
        ArrowStateService,
        ElPositionerService,
        ArrowPropertyService,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class ArrowChartComponent implements OnInit, OnDestroy {
    @Input() id!: number;
    @Input() width!: number;
    @Input() height!: number;
    @Input() rebuild!: boolean;
    @Input() showFastCreator: boolean = true;
    @ViewChild('chart', { static: true }) chart!: ElementRef;

    public isEmpty!: BehaviorSubject<boolean>;
    public activityTxt!: string;
    public activityCreator!: Subject<boolean>;
    public creationMode: string = CONST.MULTI_ARROW_CREATION_MODE;
    public autoArrange: boolean = false;
    private ui: ArrowChartUIService;

    constructor() {
        this.ui = inject(ArrowChartUIService);
    }
    public ngOnInit(): void {
        this.isEmpty = this.ui.projIsEmpty;
        this.ui.init(this.width, this.height, this.id, this.rebuild, this.chart.nativeElement);
    }
    public deselectItem(e: Event): void {
        this.ui.deselectItem();
    }
    public disableDeletes(e: Event): void {
        this.ui.disableDeletes();
    }
    public processActivityTxt(event: KeyboardEvent): void {
        this.ui.createFastActivity(event, this.creationMode, this.autoArrange);
        if (event.key === 'Enter') {
            this.activityTxt = '';
        }
    }
    public ngOnDestroy(): void {
        this.ui.destroy();
    }
}
