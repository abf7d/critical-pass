import { TestBed } from '@angular/core/testing';

import { ProjectElFactoryService } from './project-el-factory.service';

describe('ProjectElFactoryService', () => {
    let service: ProjectElFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProjectElFactoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
