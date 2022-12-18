import { TestBed } from '@angular/core/testing';

import { NodeArrangerService } from './node-arranger.service';

describe('NodeArrangerService', () => {
  let service: NodeArrangerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeArrangerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
