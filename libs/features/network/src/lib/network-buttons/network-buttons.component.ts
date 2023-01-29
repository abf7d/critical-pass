import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '@critical-pass/project/types';
import { BehaviorSubject, Subject } from 'rxjs';
import { CORE_CONST } from '@critical-pass/core';
import { EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { NetworkFileManagerService } from '@critical-pass/shared/file-management';
import { NodeConnectorService } from '@critical-pass/project/processor';
import { UTIL_CONST } from '@critical-pass/shared/project-utils';
@Component({
    selector: 'proj-meta-buttons',
    templateUrl: './network-buttons.component.html',
    styleUrls: ['./network-buttons.component.scss'],
})
export class NetworkButtonsComponent implements OnInit {
    public id!: number;
    public networkArray$: BehaviorSubject<Project[]>;
    public filteredNetworkArray$: Subject<Project[]>;
    constructor(
        private route: ActivatedRoute,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        private router: Router,
        private fileManager: NetworkFileManagerService,
        private nodeConnector: NodeConnectorService,
    ) {
        this.networkArray$ = this.eventService.get(CORE_CONST.NETWORK_ARRAY_KEY);
        this.filteredNetworkArray$ = this.eventService.get(CORE_CONST.FILTERED_NETWORK_ARRAY_KEY);
    }

    public ngOnInit() {
        this.id = +this.route.snapshot.params['id'];
    }

    public navToSingleGraph() {
        this.router.navigateByUrl(`network/(${this.id}//sidebar:arrow/${this.id})`);
    }
    public navToMetaGraph() {
        this.router.navigateByUrl(`network/(${this.id}//sidebar:meta/${this.id})`);
    }
    public saveByDownload() {
        const nodes = this.networkArray$.getValue();
        if (nodes) {
            this.fileManager.export(nodes);
        }
    }
    public loadFileByUpload(event: any) {
        const files = event.files as FileList;
        const firstFile = files.item(0);

        if (firstFile !== null && files.length > 0) {
            this.fileManager.import(firstFile).then(projects => {
                projects.forEach(project => {
                    this.nodeConnector.connectArrowsToNodes(project);
                });
                let mostRecentId = Math.min(...projects.map(p => p.profile.id));
                if (mostRecentId >= 0) {
                    mostRecentId = -1;
                }
                mostRecentId -= 1;
                this.eventService.get(UTIL_CONST.NETWORK_SUB_PROJECT_TRACKER).next(mostRecentId);
                this.networkArray$.next([...projects]);
                this.filteredNetworkArray$.next([...projects]);
            });
        }
    }
}
