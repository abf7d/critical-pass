import { TestBed } from '@angular/core/testing';

import { JiraImportMapperService } from './jira-import-mapper.service';

describe('JiraImportMapperService', () => {
  let service: JiraImportMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JiraImportMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
