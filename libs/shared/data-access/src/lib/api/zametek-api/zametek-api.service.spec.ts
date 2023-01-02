import { TestBed } from '@angular/core/testing';

import { ZametekApiService } from './zametek-api.service';

describe('ZametekApiService', () => {
  let service: ZametekApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZametekApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
