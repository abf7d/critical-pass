import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityListBarComponent } from './activity-list-bar.component';

describe('ActivityListBarComponent', () => {
  let component: ActivityListBarComponent;
  let fixture: ComponentFixture<ActivityListBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityListBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityListBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
