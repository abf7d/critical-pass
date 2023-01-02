import { TestBed } from '@angular/core/testing';

import { FileCompilerService } from './file-compiler.service';

describe('FileCompilerService', () => {
  let service: FileCompilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileCompilerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
