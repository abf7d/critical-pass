import { TestBed } from '@angular/core/testing';

import { ArrowPropertyService } from './arrow-property.service';

describe('ArrowPropertyService', () => {
    let service: ArrowPropertyService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ArrowPropertyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
