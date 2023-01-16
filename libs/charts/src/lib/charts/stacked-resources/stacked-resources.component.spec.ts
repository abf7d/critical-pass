import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedResourcesComponent } from './stacked-resources.component';

describe('StackedResourcesComponent', () => {
  let component: StackedResourcesComponent;
  let fixture: ComponentFixture<StackedResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StackedResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
