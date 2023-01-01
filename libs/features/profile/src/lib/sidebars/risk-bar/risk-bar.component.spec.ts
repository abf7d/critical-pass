import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskBarComponent } from './risk-bar.component';

describe('RiskBarComponent', () => {
  let component: RiskBarComponent;
  let fixture: ComponentFixture<RiskBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
