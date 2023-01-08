import { TestBed } from '@angular/core/testing';

import { ShallowSUiService } from './shallow-s-ui.service';

describe('ShallowSUiService', () => {
  let service: ShallowSUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShallowSUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
