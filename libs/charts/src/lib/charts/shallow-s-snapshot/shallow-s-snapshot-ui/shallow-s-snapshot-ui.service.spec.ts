import { TestBed } from '@angular/core/testing';

import { ShallowSSnapshotUiService } from './shallow-s-snapshot-ui.service';

describe('ShallowSSnapshotUiService', () => {
    let service: ShallowSSnapshotUiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ShallowSSnapshotUiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
