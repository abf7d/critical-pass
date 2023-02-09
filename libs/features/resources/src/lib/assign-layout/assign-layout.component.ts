import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'cp-assign-layout',
    templateUrl: './assign-layout.component.html',
    styleUrls: ['./assign-layout.component.scss'],
})
export class AssignLayoutComponent implements OnInit {
    public subRoute!: string;
    public project$: Observable<Project>;
    private refresh = 0;
    private subscription!: Subscription;
    public id: number;

    constructor(@Inject(DASHBOARD_TOKEN) private dashboard: DashboardService, route: ActivatedRoute, private router: Router) {
        this.id = +route.snapshot.params['id'];
        this.project$ = this.dashboard.activeProject$;
    }

    public ngOnInit(): void {
        this.subRoute = this.getSubpage(window.location.href);
        this.router.events.subscribe((event: any) => {
            if (event != null && event.url != null) {
                const url = event.url;
                const subpage = this.getSubpage(url);
                if (subpage !== '') {
                    this.subRoute = subpage;
                }
            }
        });

        this.subscription = this.project$.pipe(filter(x => !!x)).subscribe(_ => this.refresh++);
    }
    public canDeactivate(): boolean {
        return this.refresh < 2;
    }
    public ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
    public getSubpage(url: string): string {
        const bartext = url.split('sidebar:');
        if (bartext != null && bartext.length > 1) {
            const subpage = bartext[1].split('/');
            if (subpage != null) {
                return subpage[0];
            }
        }
        return '';
    }
}
