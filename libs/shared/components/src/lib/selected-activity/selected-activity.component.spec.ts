import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedActivityComponent } from './selected-activity.component';

describe('SelectedActivityComponent', () => {
    let component: SelectedActivityComponent;
    let fixture: ComponentFixture<SelectedActivityComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectedActivityComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectedActivityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
