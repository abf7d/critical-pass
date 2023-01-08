import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShallowSSnapshotComponent } from './shallow-s-snapshot.component';

describe('ShallowSSnapshotComponent', () => {
  let component: ShallowSSnapshotComponent;
  let fixture: ComponentFixture<ShallowSSnapshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShallowSSnapshotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShallowSSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
