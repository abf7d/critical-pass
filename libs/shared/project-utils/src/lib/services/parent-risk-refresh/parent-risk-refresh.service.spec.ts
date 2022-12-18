import { TestBed } from '@angular/core/testing';

import { ParentRiskRefreshService } from './parent-risk-refresh.service';

describe('ParentRiskRefreshService', () => {
  let service: ParentRiskRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentRiskRefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
