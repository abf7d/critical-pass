import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskCurveComponent } from './risk-curve.component';

describe('RiskCurveComponent', () => {
  let component: RiskCurveComponent;
  let fixture: ComponentFixture<RiskCurveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskCurveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskCurveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
