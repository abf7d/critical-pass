import { TestBed } from '@angular/core/testing';

import { ArrowSnapshotUiService } from './arrow-snapshot-ui.service';

describe('ArrowSnapshotUiService', () => {
    let service: ArrowSnapshotUiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ArrowSnapshotUiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
