import { TestBed } from '@angular/core/testing';

import { ChartElFactoryService } from './chart-el-factory.service';

describe('ChartElFactoryService', () => {
    let service: ChartElFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChartElFactoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
