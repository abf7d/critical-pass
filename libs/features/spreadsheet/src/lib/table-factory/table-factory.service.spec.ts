import { TestBed } from '@angular/core/testing';

import { TableFactoryService } from './table-factory.service';

describe('HeaderFactoryService', () => {
  let service: TableFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
