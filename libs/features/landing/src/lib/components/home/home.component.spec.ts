import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { of, BehaviorSubject } from 'rxjs';
import { AuthStoreService } from '../../core/services/auth-store';
describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    let httpMock: HttpTestingController;

    let authService: AuthStoreService = null;

    // https://netbasal.com/testing-observables-in-angular-a2dbbfaf5329
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent],
            providers: [{ provide: AuthStoreService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthStoreService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should should login', fakeAsync(() => {
        expect(component).toBeTruthy();
        authService.isLoggedIn$.next(true);
        tick();
        fixture.detectChanges();
        expect(component.isLoggedIn).toBeTrue();
    }));
});
