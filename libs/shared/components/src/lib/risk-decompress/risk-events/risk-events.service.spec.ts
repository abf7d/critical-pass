import { TestBed } from '@angular/core/testing';

import { RiskEventsService } from './risk-events.service';

describe('RiskEventsService', () => {
    let service: RiskEventsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RiskEventsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
