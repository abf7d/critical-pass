import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NetworkFileManagerService,
  Project,
  ProjectManagerBase,
} from '@critical-pass/critical-charts';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { ChartKeys } from '@critical-pass/critical-charts';
import * as AppKeys from '../../../../core/constants/keys';

@Component({
  selector: 'proj-meta-buttons',
  templateUrl: './meta-buttons.component.html',
  styleUrls: ['./meta-buttons.component.scss'],
})
export class MetaButtonsComponent implements OnInit {
  public id: number;
  public networkArray$: BehaviorSubject<Project[]>;
  public filteredNetworkArray$: Subject<Project[]>;
  private project: Project;
  private sub: Subscription;
  constructor(
    private route: ActivatedRoute,
    @Inject('ProjectManagerBase') private pManager: ProjectManagerBase,
    private router: Router,
    private fileManager: NetworkFileManagerService
  ) {
    this.networkArray$ = pManager.getChannel(ChartKeys.networkArray);
    this.filteredNetworkArray$ = pManager.getChannel(
      ChartKeys.filteredNetworkArray
    );
  }

  public ngOnInit() {
    this.id = +this.route.snapshot.params.id;
    this.pManager.getProject(this.id).subscribe( project => {
      this.project = project;
    })
  }

  public navToSingleGraph() {
    this.router.navigateByUrl(
      `network/(${this.id}//sidebar:arrow/${this.id})`
    );
  }
  public navToMetaGraph() {
    this.router.navigateByUrl(
      `network/(${this.id}//sidebar:meta/${this.id})`
    );
  }
  public saveByDownload() {
    const nodes = this.networkArray$.getValue()
    if(nodes) {
      this.fileManager.export(nodes);
    }
  }
  public loadFileByUpload(files: FileList) {
    if (files.length > 0) {
      this.fileManager.import(files.item(0)).then((projects) => {
        projects.forEach(project => {
          this.pManager.connectArrowsToNodes(project);
        }) 
        let mostRecentId = Math.min(...projects.map(p => p.profile.id));
        if (mostRecentId >= 0) {
          mostRecentId = -1;
        }
        mostRecentId -= 1;
        this.pManager.getChannel(AppKeys.networkSubProjTracker).next(mostRecentId);
        this.networkArray$.next([...projects]);
        this.filteredNetworkArray$.next([...projects]);
      });
    }
  }
}
