import { TestBed } from '@angular/core/testing';

import { ProjectTreenodeSerializerService } from './project-treenode-serializer.service';

describe('ProjectTreenodeSerializerService', () => {
    let service: ProjectTreenodeSerializerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProjectTreenodeSerializerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
