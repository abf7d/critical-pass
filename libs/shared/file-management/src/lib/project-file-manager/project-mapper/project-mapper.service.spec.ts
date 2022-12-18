import { TestBed } from '@angular/core/testing';

import { ProjectMapperService } from './project-mapper.service';

describe('ProjectMapperService', () => {
  let service: ProjectMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
