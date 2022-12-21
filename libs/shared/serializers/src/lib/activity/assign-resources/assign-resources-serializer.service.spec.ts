import { TestBed } from '@angular/core/testing';

import { AssignResourcesSerializerService } from './assign-resources-serializer.service';

describe('AssignResourcesSerializerService', () => {
    let service: AssignResourcesSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AssignResourcesSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
