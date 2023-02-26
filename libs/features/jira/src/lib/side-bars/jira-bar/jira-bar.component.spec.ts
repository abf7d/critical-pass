import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraBarComponent } from './jira-bar.component';

describe('JiraBarComponent', () => {
    let component: JiraBarComponent;
    let fixture: ComponentFixture<JiraBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JiraBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(JiraBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
