import { TestBed } from '@angular/core/testing';

import { ArrowSvgZoomService } from './arrow-svg-zoom.service';

describe('ArrowSvgZoomService', () => {
    let service: ArrowSvgZoomService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ArrowSvgZoomService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
