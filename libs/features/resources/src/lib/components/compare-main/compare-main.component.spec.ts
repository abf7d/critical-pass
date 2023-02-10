import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareMainComponent } from './compare-main.component';

describe('CompareMainComponent', () => {
    let component: CompareMainComponent;
    let fixture: ComponentFixture<CompareMainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CompareMainComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompareMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
