import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShallowSBarComponent } from './shallow-s-bar.component';

describe('ShallowSBarComponent', () => {
    let component: ShallowSBarComponent;
    let fixture: ComponentFixture<ShallowSBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShallowSBarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShallowSBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
