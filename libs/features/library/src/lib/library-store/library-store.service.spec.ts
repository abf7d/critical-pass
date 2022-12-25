import { TestBed } from '@angular/core/testing';

import { LibraryStoreService } from './library-store.service';

describe('ChartLoaderService', () => {
    let service: LibraryStoreService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LibraryStoreService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
