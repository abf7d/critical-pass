import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowChartComponent } from './arrow-chart.component';

describe('ArrowChartComponent', () => {
    let component: ArrowChartComponent;
    let fixture: ComponentFixture<ArrowChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ArrowChartComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ArrowChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
