import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMainComponent } from './assign-main.component';

describe('AssignMainComponent', () => {
    let component: AssignMainComponent;
    let fixture: ComponentFixture<AssignMainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AssignMainComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AssignMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
