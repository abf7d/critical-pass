import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchbookLayoutComponent } from './sketchbook-layout.component';

describe('SketchbookLayoutComponent', () => {
  let component: SketchbookLayoutComponent;
  let fixture: ComponentFixture<SketchbookLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SketchbookLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchbookLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
