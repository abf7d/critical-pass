import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LassoBarComponent } from './lasso-bar.component';

describe('LassoBarComponent', () => {
    let component: LassoBarComponent;
    let fixture: ComponentFixture<LassoBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LassoBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LassoBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
