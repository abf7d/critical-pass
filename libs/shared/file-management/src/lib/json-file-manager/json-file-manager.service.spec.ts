import { TestBed } from '@angular/core/testing';

import { JsonFileManagerService } from './json-file-manager.service';

describe('JsonFileManagerService', () => {
    let service: JsonFileManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(JsonFileManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
