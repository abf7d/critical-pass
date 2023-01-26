import { TestBed } from '@angular/core/testing';

import { GridEventsService } from './grid-events.service';

describe('GridEventsService', () => {
    let service: GridEventsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridEventsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
