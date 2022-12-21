import { TestBed } from '@angular/core/testing';

import { ProjectViewSerializerService } from './project-view-serializer.service';

describe('ProjectViewSerializerService', () => {
    let service: ProjectViewSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProjectViewSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
