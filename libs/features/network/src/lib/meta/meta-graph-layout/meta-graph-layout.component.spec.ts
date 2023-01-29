import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaGraphLayoutComponent } from './meta-graph-layout.component';

describe('MetaGraphLayoutComponent', () => {
  let component: MetaGraphLayoutComponent;
  let fixture: ComponentFixture<MetaGraphLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaGraphLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaGraphLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
