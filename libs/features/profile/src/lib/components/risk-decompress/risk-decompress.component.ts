import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectManagerBase} from '@critical-pass/critical-charts';
import { Project } from '@critical-pass/critical-charts';
import { filter } from 'rxjs/operators';
import { RiskEventsService } from './risk-events/risk-events.service';

@Component({
  selector: 'cp-risk-decompress',
  templateUrl: './risk-decompress.component.html',
  styleUrls: ['./risk-decompress.component.scss']
})
export class RiskDecompressComponent implements OnInit {

  private project: Project;
  private id: number;
  public start: number;
  public end: number;
  public enableArranging: boolean;

  constructor(private route: ActivatedRoute, @Inject('ProjectManagerBase') private pManager: ProjectManagerBase, private events: RiskEventsService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.pManager.getProject(this.id).pipe(filter(x => !!x)).subscribe( project => {
      this.project = project;
      this.start = project.profile.start;
      this.end = project.profile.end;
      // const hasSelectedNode = !!project.profile.view.selectedIntegration;
      this.enableArranging = true // hasSelectedNode || this.events.isGraphConnected(project);
    });
  }

  public calculateRisk(): void {
    this.pManager.setStartEndNodes(this.id, this.project);
    this.pManager.updateProject(this.id, this.project, true);
  }

  public setStart(start: string): void {
    this.project.profile.start = +start;
    this.pManager.updateProject(this.id, this.project, true);
  }
  public setEnd(end: string): void {
    this.project.profile.end = +end;
    this.pManager.updateProject(this.id, this.project, true);
  }
 
  public arrangeNodes(): void {
    this.pManager.arrangeNodes(this.project);
    this.pManager.updateProject(this.id, this.project, false);
  }
}
