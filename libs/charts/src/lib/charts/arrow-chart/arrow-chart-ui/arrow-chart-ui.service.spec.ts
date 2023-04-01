import { TestBed } from '@angular/core/testing';

import { ArrowChartUIService } from './arrow-chart-ui.service';

describe('ArrowChartUiService', () => {
    let service: ArrowChartUIService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ArrowChartUIService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // write a unit test for init
});
