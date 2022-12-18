import { TestBed } from '@angular/core/testing';

import { CompletionCalcService } from './completion-calc.service';

describe('CompletionCalcService', () => {
  let service: CompletionCalcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompletionCalcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
