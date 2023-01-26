import { TestBed } from '@angular/core/testing';

import { RiskCurveUiService } from './risk-curve-ui.service';

describe('RiskCurveUiService', () => {
    let service: RiskCurveUiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RiskCurveUiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
