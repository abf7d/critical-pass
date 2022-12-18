import { TestBed } from '@angular/core/testing';

import { DependencyCrawlerService } from './dependency-crawler.service';

describe('DependencyCrawlerService', () => {
    let service: DependencyCrawlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DependencyCrawlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
