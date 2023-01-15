import { TestBed } from '@angular/core/testing';

import { ArrowChartUiService } from './arrow-chart-ui.service';

describe('ArrowChartUiService', () => {
  let service: ArrowChartUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrowChartUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
