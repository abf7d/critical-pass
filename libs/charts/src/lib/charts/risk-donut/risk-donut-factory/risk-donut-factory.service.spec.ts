import { TestBed } from '@angular/core/testing';

import { RiskDonutFactoryService } from './risk-donut-factory.service';

describe('RiskDonutFactoryService', () => {
  let service: RiskDonutFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskDonutFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
