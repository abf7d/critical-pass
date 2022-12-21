import { TestBed } from '@angular/core/testing';

import { ActivityErrorSerializerService } from './activity-error-serializer.service';

describe('ActivityErrorSerializerService', () => {
    let service: ActivityErrorSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ActivityErrorSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
