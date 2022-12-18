import { TestBed } from '@angular/core/testing';

import { IndirectCostCalculatorService } from './indirect-cost-calculator.service';

describe('IndirectCostCalculatorService', () => {
  let service: IndirectCostCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndirectCostCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
