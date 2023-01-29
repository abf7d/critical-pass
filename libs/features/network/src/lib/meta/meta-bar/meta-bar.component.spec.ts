import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaBarComponent } from './meta-bar.component';

describe('MetaBarComponent', () => {
  let component: MetaBarComponent;
  let fixture: ComponentFixture<MetaBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
