import { TestBed } from '@angular/core/testing';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN, ZametekApiService } from '@critical-pass/shared/data-access';
import { TimeCostComponent } from './time-cost.component';
import { TimeCostModule } from './time-cost.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { Project } from '@critical-pass/project/types';

describe(TimeCostComponent.name, () => {

  beforeEach(() => {
    const zametek = {
      compileMsProject(file: File): Observable<Project | null> {
        return of(null);
      },
      compileArrowGraph(project: Project): Observable<Project | null> {
        return of(null)
      }
    }
    TestBed.overrideComponent(TimeCostComponent, {
      add: { 
        imports: [TimeCostModule, HttpClientTestingModule],
        providers: [ 
          { provide: ZametekApiService, useValue: zametek },
          { provide: DASHBOARD_TOKEN, useClass: DashboardService },
          { provide: EVENT_SERVICE_TOKEN, useClass: EventService },]
      }
    }) 
  })

  it('renders', () => {
     cy.mount(TimeCostComponent, {
           componentProperties: {
               id:  0,
               width:  0,
               height:  0,
          }
       });
  })

})
