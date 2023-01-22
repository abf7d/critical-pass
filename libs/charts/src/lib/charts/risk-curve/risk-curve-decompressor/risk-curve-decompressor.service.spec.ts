import { TestBed } from '@angular/core/testing';

import { RiskCurveDecompressorService } from './risk-curve-decompressor.service';

describe('RiskCurveDecompressorService', () => {
  let service: RiskCurveDecompressorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskCurveDecompressorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
