import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraLayoutComponent } from './jira-layout.component';

describe('JiraLayoutComponent', () => {
    let component: JiraLayoutComponent;
    let fixture: ComponentFixture<JiraLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JiraLayoutComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(JiraLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
