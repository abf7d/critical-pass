import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceCardsComponent } from './resource-cards.component';

describe('ResourceCardsComponent', () => {
  let component: ResourceCardsComponent;
  let fixture: ComponentFixture<ResourceCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
