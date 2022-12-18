import { TestBed } from '@angular/core/testing';

import { ProjectExtractorService } from './project-extractor.service';

describe('ProjectExtractorService', () => {
    let service: ProjectExtractorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProjectExtractorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
