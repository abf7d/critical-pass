import { TestBed } from '@angular/core/testing';

import { DanglingArrowService } from './dangling-arrow.service';

describe('ActivityUtilsService', () => {
  let service: DanglingArrowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DanglingArrowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
