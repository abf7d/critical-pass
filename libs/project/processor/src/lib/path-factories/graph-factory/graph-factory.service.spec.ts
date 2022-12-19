import { TestBed } from '@angular/core/testing';

import { GraphFactoryService } from './graph-factory.service';

describe('GraphFactoryService', () => {
    let service: GraphFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GraphFactoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
