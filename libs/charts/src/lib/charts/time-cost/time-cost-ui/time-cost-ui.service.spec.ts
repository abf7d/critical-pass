import { TestBed } from '@angular/core/testing';

import { TimeCostUiService } from './time-cost-ui.service';

describe('TimeCostUiService', () => {
  let service: TimeCostUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeCostUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
