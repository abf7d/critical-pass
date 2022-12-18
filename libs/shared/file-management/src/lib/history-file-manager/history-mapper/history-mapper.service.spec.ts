import { TestBed } from '@angular/core/testing';

import { HistoryMapperService } from './history-mapper.service';

describe('HistoryMapperService', () => {
    let service: HistoryMapperService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HistoryMapperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
