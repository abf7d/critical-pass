import { TestBed } from '@angular/core/testing';

import { NetworkOperationsService } from './network-operations.service';

describe('NetworkOperationsService', () => {
  let service: NetworkOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
