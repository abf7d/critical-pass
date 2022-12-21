import { TestBed } from '@angular/core/testing';

import { SubprojectSerializerService } from './subproject-serializer.service';

describe('SubprojectSerializerService', () => {
    let service: SubprojectSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SubprojectSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
