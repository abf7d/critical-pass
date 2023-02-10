import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTagsComponent } from './activity-tags.component';

describe('ActivityTagsComponent', () => {
    let component: ActivityTagsComponent;
    let fixture: ComponentFixture<ActivityTagsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ActivityTagsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityTagsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
