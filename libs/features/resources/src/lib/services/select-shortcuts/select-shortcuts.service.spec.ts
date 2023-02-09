import { TestBed } from '@angular/core/testing';

import { SelectShortcutsService } from './select-shortcuts.service';

describe('SelectShortcutsService', () => {
  let service: SelectShortcutsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectShortcutsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
