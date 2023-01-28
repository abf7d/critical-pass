import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TimeCostFactoryService } from './time-cost-factory/time-cost-factory.service';
import { TimeCostUiService } from './time-cost-ui/time-cost-ui.service';

@Component({
  selector: 'cp-time-cost',
  template: `
    <div class="btn-container">
      <a class="calc-button" href="javascript:void(0)" 
        (click)="calculateTimeCost()">Calculate Time Cost Curve</a>
    </div>
    <div #chart class="time-cost-container"></div>
    `,
  styleUrls: ['./time-cost.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimeCostComponent implements OnInit {

  @Input() id: number;
  @Input() width: number;
  @Input() height: number;
  @ViewChild('chart', { static: true }) chart: ElementRef;
  private ui: TimeCostUiService

  constructor(factory: TimeCostFactoryService) {
      this.ui = factory.ui;
  }

  public calculateTimeCost(): void {
      this.ui.calculateTimeCostPoints();
  }

  public ngOnInit(): void {
      this.ui.init(this.width, this.height, this.id, this.chart.nativeElement);
  }

  public ngOnDestroy() {
      this.ui.destroy();
  }

}
