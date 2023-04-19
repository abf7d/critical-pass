import { TestBed } from '@angular/core/testing';

import { ArrowControllerService } from './arrow-controller.service';

describe('ArrowControllerService', () => {
    let service: ArrowControllerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ArrowControllerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
