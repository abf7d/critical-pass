import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkButtonsComponent } from './network-buttons.component';

describe('NetworkButtonsComponent', () => {
    let component: NetworkButtonsComponent;
    let fixture: ComponentFixture<NetworkButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NetworkButtonsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NetworkButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
