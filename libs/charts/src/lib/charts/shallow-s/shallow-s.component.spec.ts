import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShallowSComponent } from './shallow-s.component';

describe('ShallowSComponent', () => {
    let component: ShallowSComponent;
    let fixture: ComponentFixture<ShallowSComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShallowSComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShallowSComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
