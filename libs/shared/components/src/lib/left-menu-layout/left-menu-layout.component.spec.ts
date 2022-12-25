import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftMenuLayoutComponent } from './left-menu-layout.component';

describe('LeftMenuLayoutComponent', () => {
    let component: LeftMenuLayoutComponent;
    let fixture: ComponentFixture<LeftMenuLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LeftMenuLayoutComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LeftMenuLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
