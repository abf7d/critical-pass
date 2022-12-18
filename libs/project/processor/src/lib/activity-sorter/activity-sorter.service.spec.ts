import { TestBed } from '@angular/core/testing';

import { ActivitySorterService } from './activity-sorter.service';

describe('ActivitySorterService', () => {
  let service: ActivitySorterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitySorterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
