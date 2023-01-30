import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDefComponent } from './column-def.component';

describe('ColumnDefComponent', () => {
    let component: ColumnDefComponent;
    let fixture: ComponentFixture<ColumnDefComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ColumnDefComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColumnDefComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
