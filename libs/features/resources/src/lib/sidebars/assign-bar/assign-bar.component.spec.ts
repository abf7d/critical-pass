import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignBarComponent } from './assign-bar.component';

describe('AssignBarComponent', () => {
  let component: AssignBarComponent;
  let fixture: ComponentFixture<AssignBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
