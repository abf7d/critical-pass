import { TestBed } from '@angular/core/testing';

import { EndNodesLocatorService } from './end-nodes-locator.service';

describe('EndNodesLocatorService', () => {
  let service: EndNodesLocatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndNodesLocatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
