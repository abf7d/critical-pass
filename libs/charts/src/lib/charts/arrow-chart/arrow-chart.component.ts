import { Component, OnInit, Input, ElementRef, ViewChild, ViewEncapsulation, OnDestroy, inject } from '@angular/core';
import { ArrowChartUIService } from './arrow-chart-ui/arrow-chart-ui.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
// import { ArrowFactoryService } from './arrow-factory/arrow-factory.service';
import * as CONST from '../../constants/constants';

@Component({
    selector: 'cp-arrow-chart',
    templateUrl: './arrow-chart.component.html',
    styleUrls: ['./arrow-chart.component.scss'],
    providers: [ArrowChartUIService],
    encapsulation: ViewEncapsulation.None,
})
export class ArrowChartComponent implements OnInit, OnDestroy {
    @Input() id!: number;
    @Input() width!: number;
    @Input() height!: number;
    @Input() rebuild!: boolean;
    @ViewChild('chart', { static: true }) chart!: ElementRef;

    public isEmpty!: BehaviorSubject<boolean>;
    public activityTxt!: string;
    public activityCreator!: Subject<boolean>;
    public creationMode: string = CONST.MULTI_ARROW_CREATION_MODE;
    public autoArrange: boolean = false;
    private ui: ArrowChartUIService;

    constructor(/*private factory: ArrowFactoryService*/) {
        // this.ui = this.factory.ui;
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
