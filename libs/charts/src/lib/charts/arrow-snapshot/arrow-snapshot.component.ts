import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, ViewEncapsulation, SimpleChanges, OnChanges, inject } from '@angular/core';
import { ArrowSnapshotUiService } from './arrow-snapshot-ui/arrow-snapshot-ui.service';
// import { Project } from '../../models/project/project';
// import { ArrowSnapshotFactoryService } from './arrow-snapshot-factory/arrow-snapshot-factory.service';
import { Project } from '@critical-pass/project/models';
@Component({
  selector: 'cp-arrow-snapshot',
  template: `<div #chart class="arrow-snapshot"></div>`,
  styleUrls: ['./arrow-snapshot.component.scss'],
  providers: [ArrowSnapshotUiService], // provide a service
  encapsulation: ViewEncapsulation.None
})
export class ArrowSnapshotComponent implements OnInit, OnDestroy, OnChanges {

  @Input() id!: number;
  @Input() width!: number;
  @Input() height!: number;
  @Input() parentId!: string;
  @Input() project!: Project;
  @Input() refresh!: number;
  @ViewChild('chart', { static: true }) chart!: ElementRef;
  private ui!: ArrowSnapshotUiService;
  constructor(/*factory: ArrowSnapshotFactoryService, ui: ArrowSnapshotUiService*/ ) {
    // this.ui = factory.ui;
    this.ui = inject(ArrowSnapshotUiService)
   }

  public ngOnInit(): void {
    if (!this.project) {
      this.ui.init(this.width, this.height, this.id, this.parentId, this.chart.nativeElement);
    }
    else {
      this.ui.renderStatic(this.project, this.width, this.height, this.chart.nativeElement);
    }
  }

  public ngOnDestroy() {
    this.ui.destroy();
  }

  public ngOnChanges(changes: SimpleChanges) {
      if(changes['refresh']?.currentValue && this.project) {
          this.ui.renderStatic(this.project, this.width, this.height, this.chart.nativeElement, false);
      }
  }

}
