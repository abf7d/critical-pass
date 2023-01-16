import { TestBed } from '@angular/core/testing';

import { StackedResourcesUiService } from './stacked-resources-ui.service';

describe('StackedResourcesUiService', () => {
    let service: StackedResourcesUiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StackedResourcesUiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
