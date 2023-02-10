import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignActivityGridComponent } from './assign-activity-grid.component';

describe('AssignActivityGridComponent', () => {
    let component: AssignActivityGridComponent;
    let fixture: ComponentFixture<AssignActivityGridComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AssignActivityGridComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AssignActivityGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
