import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeButtonsComponent } from './tree-buttons.component';

describe('TreeButtonsComponent', () => {
    let component: TreeButtonsComponent;
    let fixture: ComponentFixture<TreeButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TreeButtonsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
