import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDecompressComponent } from './risk-decompress.component';

describe('RiskDecompressComponent', () => {
  let component: RiskDecompressComponent;
  let fixture: ComponentFixture<RiskDecompressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskDecompressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskDecompressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
