import { TestBed } from '@angular/core/testing';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ShallowSComponent } from './shallow-s.component';
import { ShallowSModule } from './shallow-s.module';

describe(ShallowSComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(ShallowSComponent, {
      add: { 
        imports: [ShallowSModule],
        providers: [
          { provide: DASHBOARD_TOKEN, useClass: DashboardService },
          { provide: EVENT_SERVICE_TOKEN, useClass: EventService },]
      }
    }) 
  })

  it('renders', () => {
     cy.mount(ShallowSComponent, {
           componentProperties: {
               id:  0,
               width:  0,
               height:  0,
          }
       });
  })

})
