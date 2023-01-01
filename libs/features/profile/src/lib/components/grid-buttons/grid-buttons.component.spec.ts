import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridButtonsComponent } from './grid-buttons.component';

describe('GridButtonsComponent', () => {
    let component: GridButtonsComponent;
    let fixture: ComponentFixture<GridButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GridButtonsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GridButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
