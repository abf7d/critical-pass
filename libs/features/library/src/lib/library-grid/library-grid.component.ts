import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '@critical-pass/project/types';
// import { ProjectManagerBase} from '@critical-pass/critical-charts';
// import { ProjectStoreBase } from '@critical-pass/critical-charts';
// import { Project } from '@critical-pass/critical-charts';
// import { ProjectSerializerService } from '@critical-pass/critical-charts';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LibraryStoreService } from '../library-store/library-store.service';
// import * as Keys from '../../../../core/constants/keys';
// import { List } from '@critical-pass/critical-charts';
import * as CONST from '../constants';
import { ProjectApiService } from '@critical-pass/shared/data-access';
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
    // public projSerializer: ProjectSerializerService;
    public pageNumSub!: Subscription;
    constructor(
        private router: Router,
        // @Inject('ProjectStoreBase') private projectStore: ProjectStoreBase,
        private libraryStore: LibraryStoreService, // @Inject('ProjectManagerBase') private pManager: ProjectManagerBase,
        private projectApi: ProjectApiService,
        private nodeConnector: NodeConnectorService,
    ) {}

    public ngOnInit(): void {
        // this.projSerializer = new ProjectSerializerService();
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
        this.router.navigateByUrl(`sketchbook/(${id}//sidebar:arrow/${id})`);
    }

    public navigateAssign(id: number) {
        this.router.navigateByUrl(`assign/(${id}//sidebar:assignbar/${id})`);
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
        console.log('projects', projects);
        this.projects = projects;
    }

    public ngOnDestroy() {
        if (this.pageNumSub) {
            this.pageNumSub.unsubscribe();
        }
    }
}
