import { TestBed } from '@angular/core/testing';

import { MilestoneFactoryService } from './milestone-factory.service';

describe('MilestoneFactoryService', () => {
  let service: MilestoneFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilestoneFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
