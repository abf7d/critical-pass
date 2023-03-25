import { TestBed } from '@angular/core/testing';

import { TagSerializerService } from './tag-serializer.service';

describe('TagSerializerService', () => {
  let service: TagSerializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagSerializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
