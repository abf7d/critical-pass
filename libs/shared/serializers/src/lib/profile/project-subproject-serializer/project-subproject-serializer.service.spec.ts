import { TestBed } from '@angular/core/testing';

import { ProjectSubprojectSerializerService } from './project-subproject-serializer.service';

describe('ProjectSubprojectSerializerService', () => {
    let service: ProjectSubprojectSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProjectSubprojectSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
