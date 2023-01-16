import { TestBed } from '@angular/core/testing';

import { StackedResourcesSchedulerService } from './stacked-resources-scheduler.service';

describe('StackedResourcesSchedulerService', () => {
  let service: StackedResourcesSchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StackedResourcesSchedulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
