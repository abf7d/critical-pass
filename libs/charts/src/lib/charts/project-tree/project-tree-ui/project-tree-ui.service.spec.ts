import { TestBed } from '@angular/core/testing';

import { ProjectTreeUiService } from './project-tree-ui.service';

describe('ProjectTreeUiService', () => {
    let service: ProjectTreeUiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProjectTreeUiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
