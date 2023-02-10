import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTagsComponent } from './resource-tags.component';

describe('ResourceTagsComponent', () => {
    let component: ResourceTagsComponent;
    let fixture: ComponentFixture<ResourceTagsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ResourceTagsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceTagsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
