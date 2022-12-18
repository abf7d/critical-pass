import { TestBed } from '@angular/core/testing';

import { ProjectCompilerService } from './project-compiler.service';

describe('ProjectCompilerrService', () => {
  let service: ProjectCompilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectCompilerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
