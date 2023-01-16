import { Component, ElementRef, inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { RiskDonutFactoryService } from './risk-donut-factory/risk-donut-factory.service';
import { RiskDonutUiService } from './risk-donut-ui/risk-donut-ui.service';

@Component({
    selector: 'cp-risk-donut',
    template: `<div #chart class="risk-donut"></div>`,
    styleUrls: ['./risk-donut.component.scss'],
    providers: [RiskDonutUiService],
    encapsulation: ViewEncapsulation.None,
})
export class RiskDonutComponent implements OnInit {
    @Input() id!: number;
    @Input() width!: number;
    @Input() height!: number;
    @ViewChild('chart', { static: true }) chart!: ElementRef;
    private ui: RiskDonutUiService;

    constructor() {
        this.ui = inject(RiskDonutUiService);
    }

    ngOnInit(): void {
        this.ui.init(this.width, this.height, this.id, this.chart.nativeElement);
    }

    ngOnDestroy() {
        this.ui.destroy();
    }
}
