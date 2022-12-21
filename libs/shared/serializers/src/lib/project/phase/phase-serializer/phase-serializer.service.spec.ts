import { TestBed } from '@angular/core/testing';

import { PhaseSerializerService } from './phase-serializer.service';

describe('PhaseSerializerService', () => {
    let service: PhaseSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PhaseSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
