import { TestBed } from '@angular/core/testing';

import { StackedResourcesFactoryService } from './stacked-resources-factory.service';

describe('StackedResourcesFactoryService', () => {
    let service: StackedResourcesFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StackedResourcesFactoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
