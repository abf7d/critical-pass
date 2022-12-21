import { TestBed } from '@angular/core/testing';

import { ProcessedSerializerService } from './processed-serializer.service';

describe('ProcessedSerializerService', () => {
    let service: ProcessedSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProcessedSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
