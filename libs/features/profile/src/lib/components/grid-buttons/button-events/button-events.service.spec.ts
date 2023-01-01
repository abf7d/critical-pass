import { TestBed } from '@angular/core/testing';

import { ButtonEventsService } from './button-events.service';

describe('ButtonEventsService', () => {
  let service: ButtonEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
