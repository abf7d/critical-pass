import { TestBed } from '@angular/core/testing';

import { CriticalPathUtilsService } from './critical-path-utils.service';

describe('CriticalPathUtilsService', () => {
    let service: CriticalPathUtilsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CriticalPathUtilsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
