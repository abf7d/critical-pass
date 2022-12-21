import { TestBed } from '@angular/core/testing';

import { RoleSerializerService } from './role-serializer.service';

describe('RoleSerializerService', () => {
    let service: RoleSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RoleSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
