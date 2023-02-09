import { TestBed } from '@angular/core/testing';

import { RoleFactoryService } from './role-factory.service';

describe('RoleFactoryService', () => {
  let service: RoleFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
