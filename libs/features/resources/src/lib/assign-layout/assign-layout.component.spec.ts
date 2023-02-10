import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignLayoutComponent } from './assign-layout.component';

describe('AssignLayoutComponent', () => {
    let component: AssignLayoutComponent;
    let fixture: ComponentFixture<AssignLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AssignLayoutComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AssignLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
