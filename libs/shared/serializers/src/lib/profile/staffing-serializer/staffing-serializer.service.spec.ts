import { TestBed } from '@angular/core/testing';

import { StaffingSerializerService } from './staffing-serializer.service';

describe('StaffingSerializerService', () => {
    let service: StaffingSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StaffingSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
