import { TestBed } from '@angular/core/testing';

import { MappingFileManagerService } from './mapping-file-manager.service';

describe('MappingFileManagerService', () => {
  let service: MappingFileManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MappingFileManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
