import { TestBed } from '@angular/core/testing';

import { ShallowSFactoryService } from './shallow-s-factory.service';

describe('ShallowSFactoryService', () => {
  let service: ShallowSFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShallowSFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
