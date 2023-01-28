import { TestBed } from '@angular/core/testing';

import { TimeCostFactoryService } from './time-cost-factory.service';

describe('TimeCostFactoryService', () => {
  let service: TimeCostFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeCostFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
