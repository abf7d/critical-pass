import { TestBed } from '@angular/core/testing';

import { DesktopProjectApiService } from './desktop-project-api.service';

describe('DesktopProjectApiService', () => {
    let service: DesktopProjectApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DesktopProjectApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
