import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetHeaderComponent } from './sheet-header.component';

describe('SheetHeaderComponent', () => {
    let component: SheetHeaderComponent;
    let fixture: ComponentFixture<SheetHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SheetHeaderComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SheetHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
