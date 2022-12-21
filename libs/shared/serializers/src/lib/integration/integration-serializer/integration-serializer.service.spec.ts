import { TestBed } from '@angular/core/testing';

import { IntegrationSerializerService } from './integration-serializer.service';

describe('IntegrationSerializerService', () => {
    let service: IntegrationSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IntegrationSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
