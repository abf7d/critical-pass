import { TestBed } from '@angular/core/testing';

import { ProjectValidatorService } from './project-validator.service';

describe('ProjectValidatorService', () => {
  let service: ProjectValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
