import { TestBed } from '@angular/core/testing';

import { FloatFactoryService } from './float-factory.service';

describe('FloatSerializerService', () => {
  let service: FloatFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FloatFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
