import { TestBed } from '@angular/core/testing';

import { EventBinderService } from './event-binder.service';

describe('EventBinderService', () => {
    let service: EventBinderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EventBinderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
