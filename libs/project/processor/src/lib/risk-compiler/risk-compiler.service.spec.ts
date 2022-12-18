import { TestBed } from '@angular/core/testing';

import { RiskCompilerService } from './risk-compiler.service';

describe('RiskCompilerService', () => {
    let service: RiskCompilerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RiskCompilerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
