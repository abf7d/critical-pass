import { TestBed } from '@angular/core/testing';

import { ProjectSanatizerService } from './project-sanatizer.service';

describe('ProjectSanatizerService', () => {
  let service: ProjectSanatizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSanatizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
