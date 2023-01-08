import { TestBed } from '@angular/core/testing';

import { ShallowSCalcService } from './shallow-s-calc.service';

describe('ShallowSCalcService', () => {
    let service: ShallowSCalcService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ShallowSCalcService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
