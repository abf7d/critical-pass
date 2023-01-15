import { TestBed } from '@angular/core/testing';

import { LassoToolService } from './lasso-tool.service';

describe('LassoToolService', () => {
    let service: LassoToolService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LassoToolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
