import { TestBed } from '@angular/core/testing';

import { VertexGraphBuilderService } from './vertex-graph-builder.service';

describe('VertexGraphBuilderService', () => {
  let service: VertexGraphBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VertexGraphBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
