import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowSnapshotComponent } from './arrow-snapshot.component';

describe('ArrowSnapshotComponent', () => {
  let component: ArrowSnapshotComponent;
  let fixture: ComponentFixture<ArrowSnapshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowSnapshotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrowSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
