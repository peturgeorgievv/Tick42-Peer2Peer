import { FormBuilder } from '@angular/forms';
import { SignInComponent } from './sign-in.component';
import { DashboardComponent } from './../../features/dashboard/dashboard.component';
import { AuthenticationService } from './../../core/services/authentication.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Routes, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../shared/shared.module';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SignInComponent', () => {
	const routes: Routes = [
		{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
		{ path: 'dashboard', component: DashboardComponent }
	];

	const authService = {
		signIn() {}
	};

	let router: Router;
	let fixture: ComponentFixture<SignInComponent>;
	let component: SignInComponent;

	beforeEach(
		async(() => {
			jest.clearAllMocks();

			TestBed.configureTestingModule({
				imports: [ RouterTestingModule.withRoutes(routes), SharedModule, BrowserAnimationsModule ],
				declarations: [ SignInComponent, DashboardComponent ],
				providers: [ AuthenticationService, FormBuilder ]
			})
				.overrideProvider(AuthenticationService, { useValue: authService })
				.compileComponents();

			router = TestBed.get(Router);
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(SignInComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should initialize', () => {
		expect(component).toBeTruthy();
	});

	it('ngOnInit should create new form', () => {
		component.ngOnInit();

		expect(component.signinForm).toBeTruthy();
	});

	it('signIn should call with correct form values', () => {
		component.signinForm.controls['email'].setValue('fake@abv.bg');
		component.signinForm.controls['password'].setValue('123456');

		const signInSpy = jest.spyOn(authService, 'signIn').mockImplementation(() => of(true));

		component.signIn();

		fixture.detectChanges();

		expect(signInSpy).toHaveBeenCalledTimes(1);
		expect(signInSpy).toHaveBeenCalledWith('fake@abv.bg', '123456');
	});
});
