import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '@critical-pass/project/models';
// import { ProjectStoreBase } from '@critical-pass/critical-charts';
// import { Project } from '@critical-pass/critical-charts';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LibraryStoreService } from '../library-store/library-store.service';
// import * as Keys from '../../../../core/constants/keys';
import * as CONST from '../constants';
@Component({
    selector: 'cp-library-bar',
    templateUrl: './library-bar.component.html',
    styleUrls: ['./library-bar.component.scss'],
})
export class LibraryBarComponent implements OnInit, OnDestroy {
    public maxPage = 0;
    public currentPage = 0;
    public pageSize!: number;
    public sub!: Subscription;
    public hasWork!: boolean;

    public showPeek!: boolean;
    public peekProj!: Project;

    constructor(
        private activatedRoute: ActivatedRoute,
        private libraryStore: LibraryStoreService,
        private router: Router, // @Inject('ProjectStoreBase') private projectStore: ProjectStoreBase,
    ) {}

    public ngOnInit(): void {
        this.pageSize = CONST.LIBRARY_PAGE_SIZE;
        this.showPeek = false;

        this.activatedRoute.params.subscribe(params => {
            this.currentPage = +params['page'];
            this.sub = this.libraryStore.maxProjectCount$.pipe(filter(x => x !== null)).subscribe(count => {
                if (count !== null) this.setMaxPage(count);
            });
            this.libraryStore.pageNumber$.next(this.currentPage);
        });

        this.hasWork = this.hasSavedWork();
    }
    public setMaxPage(count: number) {
        const max = Math.ceil(count / this.pageSize);
        this.maxPage = max - 1;
    }
    public pageRight(): void {
        this.router.navigateByUrl(`/library/(grid/${this.currentPage + 1}//sidebar:libar/${this.currentPage + 1})`);
    }
    public pageLeft(): void {
        this.router.navigateByUrl(`/library/(grid/${this.currentPage - 1}//sidebar:libar/${this.currentPage - 1})`);
    }
    public hasSavedWork(): boolean {
        // const proj = this.projectStore.unstash();
        // return proj !== null;
        return true;
    }
    public ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
    public peekStorage(): void {
        // this.peekProj = this.projectStore.unstash();
    }
    public navigate(url: string): void {
        this.router.navigateByUrl(url);
    }
}
