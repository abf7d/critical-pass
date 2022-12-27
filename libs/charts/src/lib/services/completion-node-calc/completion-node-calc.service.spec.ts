import { TestBed } from '@angular/core/testing';

import { CompletionNodeCalcService } from './completion-node-calc.service';

describe('CompletionNodeCalcService', () => {
    let service: CompletionNodeCalcService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CompletionNodeCalcService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
