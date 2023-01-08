import { TestBed } from '@angular/core/testing';

import { ShallowSSnapshotFactoryService } from './shallow-s-snapshot-factory.service';

describe('ShallowSSnapshotFactoryService', () => {
    let service: ShallowSSnapshotFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ShallowSSnapshotFactoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
