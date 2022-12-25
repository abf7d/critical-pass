import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryBarComponent } from './library-bar.component';

describe('LibraryBarComponent', () => {
    let component: LibraryBarComponent;
    let fixture: ComponentFixture<LibraryBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LibraryBarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LibraryBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
