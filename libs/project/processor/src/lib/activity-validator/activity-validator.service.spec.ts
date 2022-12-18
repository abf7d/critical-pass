import { TestBed } from '@angular/core/testing';

import { ActivityValidatorService } from './activity-validator.service';

describe('ActivityValidatorService', () => {
  let service: ActivityValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
