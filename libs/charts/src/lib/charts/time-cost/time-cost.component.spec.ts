import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeCostComponent } from './time-cost.component';

describe('TimeCostComponent', () => {
    let component: TimeCostComponent;
    let fixture: ComponentFixture<TimeCostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimeCostComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TimeCostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
