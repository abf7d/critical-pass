import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryLayoutComponent } from './history-layout.component';

describe('HistoryLayoutComponent', () => {
    let component: HistoryLayoutComponent;
    let fixture: ComponentFixture<HistoryLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HistoryLayoutComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HistoryLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
