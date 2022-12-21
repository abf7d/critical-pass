import { TestBed } from '@angular/core/testing';

import { PermissionsSerializerService } from './permissions-serializer.service';

describe('PermissionsSerializerService', () => {
    let service: PermissionsSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PermissionsSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
