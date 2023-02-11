import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceArrowComponent } from './resource-arrow.component';

describe('ResourceArrowComponent', () => {
    let component: ResourceArrowComponent;
    let fixture: ComponentFixture<ResourceArrowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ResourceArrowComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ResourceArrowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
