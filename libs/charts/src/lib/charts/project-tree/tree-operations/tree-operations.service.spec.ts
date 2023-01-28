import { TestBed } from '@angular/core/testing';

import { TreeOperationsService } from './tree-operations.service';

describe('TreeOperationsService', () => {
    let service: TreeOperationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TreeOperationsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
