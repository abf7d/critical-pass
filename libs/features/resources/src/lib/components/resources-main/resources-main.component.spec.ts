import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesMainComponent } from './resources-main.component';

describe('ResourcesMainComponent', () => {
    let component: ResourcesMainComponent;
    let fixture: ComponentFixture<ResourcesMainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ResourcesMainComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourcesMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
