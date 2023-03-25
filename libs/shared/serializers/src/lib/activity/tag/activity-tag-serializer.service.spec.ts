import { TestBed } from '@angular/core/testing';

import { ActivityTagSerializerService } from './activity-tag-serializer.service';

describe('ActivityTagSerializerService', () => {
  let service: ActivityTagSerializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityTagSerializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
