import { TestBed } from '@angular/core/testing';

import { JiraFileManagerService } from './jira-file-manager.service';

describe('JiraFileManagerService', () => {
  let service: JiraFileManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JiraFileManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
