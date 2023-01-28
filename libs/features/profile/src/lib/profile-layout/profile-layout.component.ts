import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ComponentCanDeactivate, CORE_CONST } from '@critical-pass/core';
import { Project } from '@critical-pass/project/types';
@Component({
    selector: 'cp-profile',
    templateUrl: './profile-layout.component.html',
    styleUrls: ['./profile-layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProfileLayoutComponent extends ComponentCanDeactivate implements OnInit {
    public id: number;
    public subRoute!: string;
    private refresh = 0;
    public project: Observable<Project>;
    public subscription!: Subscription;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
    ) {
        super();
        this.id = +route.snapshot.params['id'];
        this.project = this.dashboard.activeProject$;
    }

    public ngOnInit(): void {
        this.id = +this.route.snapshot.params['id'];
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

        this.eventService
            .get(CORE_CONST.CLEAR_CHANGE_TRACKER)
            .pipe(filter(x => !!x))
            .subscribe(val => (this.refresh = 0));
        this.subscription = this.project.pipe(filter(x => !!x)).subscribe(_ => this.refresh++);
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
    public canDeactivate(): boolean {
        return this.refresh < 2;
    }
}
