import { TestBed } from '@angular/core/testing';

import { ActivitySerializerService } from './activity-serializer.service';

describe('ActivitySerializerService', () => {
    let service: ActivitySerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ActivitySerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
