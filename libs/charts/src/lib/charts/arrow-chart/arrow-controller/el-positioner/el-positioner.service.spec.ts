import { TestBed } from '@angular/core/testing';

import { ElPositionerService } from './el-positioner.service';

describe('ElPositionerService', () => {
    let service: ElPositionerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ElPositionerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
