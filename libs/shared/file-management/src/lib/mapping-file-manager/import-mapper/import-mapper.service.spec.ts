import { TestBed } from '@angular/core/testing';

import { ImportMapperService } from './import-mapper.service';

describe('ImportMapperService', () => {
    let service: ImportMapperService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ImportMapperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
