import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchbookActionButtonsComponent } from './sketchbook-action-buttons.component';

describe('SketchbookActionButtonsComponent', () => {
    let component: SketchbookActionButtonsComponent;
    let fixture: ComponentFixture<SketchbookActionButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SketchbookActionButtonsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SketchbookActionButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
