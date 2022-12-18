import { TestBed } from '@angular/core/testing';

import { ProjectFileManagerService } from './project-file-manager.service';

describe('ProjectFileManagerService', () => {
  let service: ProjectFileManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectFileManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
