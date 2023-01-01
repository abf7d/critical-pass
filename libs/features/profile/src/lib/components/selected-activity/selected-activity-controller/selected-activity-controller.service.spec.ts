import { TestBed } from '@angular/core/testing';

import { SelectedActivityControllerService } from './selected-activity-controller.service';

describe('SelectedActivityControllerService', () => {
    let service: SelectedActivityControllerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectedActivityControllerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
