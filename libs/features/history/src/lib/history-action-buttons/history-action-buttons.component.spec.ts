import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryActionButtonsComponent } from './history-action-buttons.component';

describe('HistoryActionButtonsComponent', () => {
    let component: HistoryActionButtonsComponent;
    let fixture: ComponentFixture<HistoryActionButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HistoryActionButtonsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HistoryActionButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
