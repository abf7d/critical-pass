import { TestBed } from '@angular/core/testing';

import { ProfileSerializerService } from './profile-serializer.service';

describe('ProfileSerializerService', () => {
    let service: ProfileSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProfileSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
