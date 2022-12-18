import { TestBed } from '@angular/core/testing';

import { NodeConnectorService } from './node-connector.service';

describe('NodeConnectorService', () => {
    let service: NodeConnectorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NodeConnectorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
