import { TestBed } from '@angular/core/testing';

import { ArrowSnapshotFactoryService } from './arrow-snapshot-factory.service';

describe('ArrowSnapshotFactoryService', () => {
    let service: ArrowSnapshotFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ArrowSnapshotFactoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
