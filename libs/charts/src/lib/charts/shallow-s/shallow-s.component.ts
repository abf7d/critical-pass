import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ShallowSFactoryService } from './shallow-s-factory/shallow-s-factory.service';
import { ShallowSUiService } from './shallow-s-ui/shallow-s-ui.service';

@Component({
    selector: 'cp-shallow-s',
    templateUrl: './shallow-s.component.html',
    styleUrls: ['./shallow-s.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShallowSComponent implements OnInit, OnDestroy {
    @Input() id: number;
    @Input() width: number;
    @Input() height: number;
    @ViewChild('chart', { static: true }) chart: ElementRef;
    public isEmpty: BehaviorSubject<boolean>;
    private ui: ShallowSUiService

    constructor(factory: ShallowSFactoryService) {
        this.isEmpty = new BehaviorSubject<boolean>(true);
        this.ui = factory.ui;
    }

    public ngOnInit(): void {
        this.ui.setProjIsEmpty(this.isEmpty);
        this.ui.init(this.width, this.height, this.id, this.chart.nativeElement);
    }

    public ngOnDestroy() {
      this.ui.destroy();
  }
}
