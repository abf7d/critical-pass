import { TestBed } from '@angular/core/testing';

import { PhaseFactoryService } from './phase-factory.service';

describe('PhaseFactoryService', () => {
  let service: PhaseFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhaseFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
