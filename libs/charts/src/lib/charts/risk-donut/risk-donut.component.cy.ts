import { TestBed } from '@angular/core/testing';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { RiskDonutComponent } from './risk-donut.component';
import { RiskDonutModule } from './risk-donut.module';

describe(RiskDonutComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(RiskDonutComponent, {
      add: { 
        imports: [RiskDonutModule],
        providers: [
          { provide: DASHBOARD_TOKEN, useClass: DashboardService },
          { provide: EVENT_SERVICE_TOKEN, useClass: EventService },]
      }
    }) 
  })

  it('renders', () => {
     cy.mount(RiskDonutComponent, {
           componentProperties: {
               id:  0,
               width:  0,
               height:  0,
          }
       });
  })

})
