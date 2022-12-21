import { TestBed } from '@angular/core/testing';

import { ChartSerializerService } from './chart-serializer.service';

describe('ChartSerializerService', () => {
    let service: ChartSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChartSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
