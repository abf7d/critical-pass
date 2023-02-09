import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignChangeChartsComponent } from './assign-change-charts.component';

describe('AssignChangeChartsComponent', () => {
  let component: AssignChangeChartsComponent;
  let fixture: ComponentFixture<AssignChangeChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignChangeChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignChangeChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
