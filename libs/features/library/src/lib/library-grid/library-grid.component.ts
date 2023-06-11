import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '@critical-pass/project/types';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LibraryStoreService } from '../library-store/library-store.service';
import * as CONST from '../constants';
import { ProjectApi, PROJECT_API_TOKEN } from '@critical-pass/shared/data-access';
import { NodeConnectorService } from '@critical-pass/project/processor';
@Component({
    selector: 'cp-library-grid',
    templateUrl: './library-grid.component.html',
    styleUrls: ['./library-grid.component.scss'],
})
export class LibraryGridComponent implements OnInit, OnDestroy {
    public pageSize!: number;
    public projects!: Project[];
    public loadResult!: string;
    public subscription!: Subscription;
    public pageNumSub!: Subscription;
    constructor(
        @Inject(PROJECT_API_TOKEN) private projectApi: ProjectApi,
        private router: Router,
        private libraryStore: LibraryStoreService,
        private nodeConnector: NodeConnectorService,
    ) {}

    public ngOnInit(): void {
        this.pageSize = CONST.LIBRARY_PAGE_SIZE;
        this.projects = [];
        this.pageNumSub = this.libraryStore.pageNumber$.pipe(filter(x => x !== null)).subscribe(currentPage => {
            if (currentPage !== null) this.loadProjects(currentPage);
        });
    }

    public navigate(id: number) {
        this.router.navigateByUrl(`profile/(${id}//sidebar:grid/${id})`);
    }

    public navigateSketch(id: number) {
        this.router.navigateByUrl(`history/(${id}//sidebar:arrow/${id})`);
    }

    public navigateAssign(id: number) {
        this.router.navigateByUrl(`resources/(${id}//sidebar:assignbar/${id})`);
    }

    public navigateMetaGraph(id: number) {
        this.router.navigateByUrl(`network/(${id}//sidebar:meta/${id})`);
    }

    private loadProjects(currentPage: number) {
        this.loadResult = 'Loading';
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = this.projectApi.list(currentPage, this.pageSize).subscribe(projects => {
            if (projects !== null) {
                this.libraryStore.maxProjectCount$.next(projects.totalCount);
                this.initProjects(projects.items);
            }
            this.loadResult = '';
        });
    }

    private initProjects(library: Project[]) {
        const projects: Project[] = [];
        for (const project of library) {
            this.nodeConnector.connectArrowsToNodes(project);
            projects.push(project);
        }
        this.projects = projects;
    }

    public ngOnDestroy() {
        if (this.pageNumSub) {
            this.pageNumSub.unsubscribe();
        }
    }
}
