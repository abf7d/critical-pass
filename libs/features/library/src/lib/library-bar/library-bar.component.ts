import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '@critical-pass/project/types';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LibraryStoreService } from '../library-store/library-store.service';
import * as CONST from '../constants';
import { API_CONST } from '@critical-pass/shared/data-access';
import { ProjectStorageApiService } from '@critical-pass/shared/data-access';
import { AUTH_CONST } from '@critical-pass/auth';
import { HttpClient } from '@angular/common/http';

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
    public peekProj!: Project | null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private libraryStore: LibraryStoreService,
        private router: Router,
        private storageApi: ProjectStorageApiService,
        private httpClient: HttpClient
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
        const proj = this.storageApi.get(API_CONST.LOCAL_STORAGE);
        return proj !== null;
    }
    public ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
    public peekStorage(): void {
        this.peekProj = this.peekProj ?? this.storageApi.get(API_CONST.LOCAL_STORAGE);
    }
    public navigate(url: string): void {
        this.router.navigateByUrl(url);
    }
    public toJira(): void {
        this.httpClient.get(AUTH_CONST.JIRA_LOGIN_URL).subscribe(test => console.log(test));
        // window.location.href = AUTH_CONST.JIRA_LOGIN_URL;
    }
}
