import { TestBed } from '@angular/core/testing';

import { RiskDonutUiService } from './risk-donut-ui.service';

describe('RiskDonutUiService', () => {
  let service: RiskDonutUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskDonutUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
