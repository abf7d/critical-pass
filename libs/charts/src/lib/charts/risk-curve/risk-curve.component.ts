import { Component, ElementRef, inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { StatsCalculatorService } from '@critical-pass/project/processor';
import { BehaviorSubject } from 'rxjs';
import { RiskCurveDecompressorService } from './risk-curve-decompressor/risk-curve-decompressor.service';
import { RiskCurveStateFactory } from './risk-curve-state/risk-curve-state';
import { RiskCurveUiService } from './risk-curve-ui/risk-curve-ui.service';

@Component({
    selector: 'cp-risk-curve',
    templateUrl: './risk-curve.component.html',
    styleUrls: ['./risk-curve.component.scss'],
    providers: [RiskCurveUiService, RiskCurveDecompressorService, StatsCalculatorService],
    host: {
        class: 'cp-risk-curve',
    },
    encapsulation: ViewEncapsulation.None,
})
export class RiskCurveComponent implements OnInit {
    @Input() id!: number;
    @Input() width!: number;
    @Input() height!: number;
    @ViewChild('chart', { static: true }) chart!: ElementRef;
    public isEmpty: BehaviorSubject<boolean>;
    private ui: RiskCurveUiService;

    constructor() {
        this.isEmpty = new BehaviorSubject<boolean>(true);
        this.ui = inject(RiskCurveUiService);
    }

    public ngOnInit(): void {
        this.ui.setProjIsEmpty(this.isEmpty);
        this.ui.init(this.width, this.height, this.id, this.chart.nativeElement);
    }

    public ngOnDestroy() {
        this.ui.destroy();
    }
}
