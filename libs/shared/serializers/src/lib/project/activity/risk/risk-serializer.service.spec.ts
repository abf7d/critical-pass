import { TestBed } from '@angular/core/testing';

import { RiskSerializerService } from './risk-serializer.service';

describe('RiskSerializerService', () => {
    let service: RiskSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RiskSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
