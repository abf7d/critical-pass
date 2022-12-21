import { TestBed } from '@angular/core/testing';

import { ProjectRiskSerializerService } from './project-risk-serializer.service';

describe('ProjectRiskSerializerService', () => {
    let service: ProjectRiskSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProjectRiskSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
