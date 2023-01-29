import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaButtonsComponent } from './meta-buttons.component';

describe('MetaButtonsComponent', () => {
  let component: MetaButtonsComponent;
  let fixture: ComponentFixture<MetaButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
