import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedResourcesBarComponent } from './stacked-resources-bar.component';

describe('StackedResourcesBarComponent', () => {
  let component: StackedResourcesBarComponent;
  let fixture: ComponentFixture<StackedResourcesBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StackedResourcesBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedResourcesBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
