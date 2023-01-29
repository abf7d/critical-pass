import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkBarComponent } from './network-bar.component';

describe('NetworkBarComponent', () => {
    let component: NetworkBarComponent;
    let fixture: ComponentFixture<NetworkBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NetworkBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NetworkBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
