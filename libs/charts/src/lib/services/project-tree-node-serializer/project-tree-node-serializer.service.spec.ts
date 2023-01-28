import { TestBed } from '@angular/core/testing';

import { ProjectTreeNodeSerializerService } from './project-tree-node-serializer.service';

describe('ProjectTreeNodeSerializerService', () => {
    let service: ProjectTreeNodeSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProjectTreeNodeSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
