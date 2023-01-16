import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDonutComponent } from './risk-donut.component';

describe('RiskDonutComponent', () => {
  let component: RiskDonutComponent;
  let fixture: ComponentFixture<RiskDonutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskDonutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
