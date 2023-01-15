import { TestBed } from '@angular/core/testing';

import { ArrowFactoryService } from './arrow-factory.service';

describe('ArrowFactoryService', () => {
  let service: ArrowFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrowFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
