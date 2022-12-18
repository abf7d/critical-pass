import { TestBed } from '@angular/core/testing';

import { HistoryFileManagerService } from './history-file-manager.service';

describe('HistoryFileManagerService', () => {
  let service: HistoryFileManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryFileManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
