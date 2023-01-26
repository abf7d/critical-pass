import { TestBed } from '@angular/core/testing';

import { RiskCurveFactoryService } from './risk-curve-factory.service';

describe('RiskCurveFactoryService', () => {
    let service: RiskCurveFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RiskCurveFactoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
