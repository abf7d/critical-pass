import { TestBed } from '@angular/core/testing';

import { ResourceFactoryService } from './resource-factory.service';

describe('ResourceFactoryService', () => {
    let service: ResourceFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResourceFactoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
