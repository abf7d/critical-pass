import { TestBed } from '@angular/core/testing';

import { PcdAutogenService } from './pcd-autogen.service';

describe('PcdAutogenService', () => {
  let service: PcdAutogenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PcdAutogenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
