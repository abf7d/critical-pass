import { TestBed } from '@angular/core/testing';

import { ProjectSerializerService } from './project-serializer.service';

describe('ProjectSerializerService', () => {
    let service: ProjectSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProjectSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
