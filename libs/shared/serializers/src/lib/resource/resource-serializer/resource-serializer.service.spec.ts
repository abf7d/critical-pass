import { TestBed } from '@angular/core/testing';

import { ResourceSerializerService } from './resource-serializer.service';

describe('ResourceSerializerService', () => {
    let service: ResourceSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResourceSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
