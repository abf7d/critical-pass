import { TestBed } from '@angular/core/testing';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ShallowSSnapshotComponent } from './shallow-s-snapshot.component';
import { ShallowSSnapshotModule } from './shallow-s-snapshot.module';

describe(ShallowSSnapshotComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(ShallowSSnapshotComponent, {
      add: { 
        imports: [ShallowSSnapshotModule],
        providers: [
          { provide: DASHBOARD_TOKEN, useClass: DashboardService },
          { provide: EVENT_SERVICE_TOKEN, useClass: EventService },]
      }
    }) 
  })

  it('renders', () => {
     cy.mount(ShallowSSnapshotComponent, {
           componentProperties: {
               id:  0,
               width:  0,
               height:  0,
          }
       });
  })

})
