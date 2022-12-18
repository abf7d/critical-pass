import { TestBed } from '@angular/core/testing';

import { NetworkFileManagerService } from './network-file-manager.service';

describe('NetworkFileManagerService', () => {
    let service: NetworkFileManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NetworkFileManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
