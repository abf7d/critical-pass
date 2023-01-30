import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileBarComponent } from './file-bar.component';

describe('FileBarComponent', () => {
    let component: FileBarComponent;
    let fixture: ComponentFixture<FileBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FileBarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FileBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
