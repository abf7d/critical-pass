import { TestBed } from '@angular/core/testing';

import { ParentCompilerService } from './parent-compiler.service';

describe('ParentCompilerService', () => {
    let service: ParentCompilerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ParentCompilerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
