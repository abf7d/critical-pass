import { TestBed } from '@angular/core/testing';

import { ProjectStorageApiService } from './project-storage-api.service';

describe('ProjectStorageApiService', () => {
  let service: ProjectStorageApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectStorageApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
