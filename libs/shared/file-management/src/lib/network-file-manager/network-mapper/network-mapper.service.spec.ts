import { TestBed } from '@angular/core/testing';

import { NetworkMapperService } from './network-mapper.service';

describe('NetworkMapperService', () => {
    let service: NetworkMapperService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NetworkMapperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
