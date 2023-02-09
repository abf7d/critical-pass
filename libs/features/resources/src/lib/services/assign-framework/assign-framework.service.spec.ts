import { TestBed } from '@angular/core/testing';

import { AssignFrameworkService } from './assign-framework.service';

describe('AssignFrameworkService', () => {
  let service: AssignFrameworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignFrameworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
