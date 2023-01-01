import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentProjectComponent } from './parent-project.component';

describe('ParentProjectComponent', () => {
  let component: ParentProjectComponent;
  let fixture: ComponentFixture<ParentProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
