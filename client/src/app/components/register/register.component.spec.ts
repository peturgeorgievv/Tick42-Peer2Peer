import { RegisterComponent } from './register.component';
import { FormBuilder } from '@angular/forms';
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
    signUp() {}
  };

  let router: Router;
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;

  beforeEach(async(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        SharedModule,
        BrowserAnimationsModule
      ],
      declarations: [RegisterComponent, DashboardComponent],
      providers: [AuthenticationService, FormBuilder]
    })
      .overrideProvider(AuthenticationService, { useValue: authService })
      .compileComponents();

    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should create new form', () => {
    component.ngOnInit();

    expect(component.registerUserForm).toBeTruthy();
  });

  it('signIn should call with correct form values', () => {
    component.registerUserForm.controls['email'].setValue('fake@abv.bg');
    component.registerUserForm.controls['password'].setValue('123456');
    component.registerUserForm.controls['firstName'].setValue('Georgi');
    component.registerUserForm.controls['lastName'].setValue('Ivanov');

    const signUpSpy = jest
      .spyOn(authService, 'signUp')
      .mockImplementation(() => of(true));

    component.signUp();

    fixture.detectChanges();

    expect(signUpSpy).toHaveBeenCalledTimes(1);
    expect(signUpSpy).toHaveBeenCalledWith(
      'fake@abv.bg',
      '123456',
      'Georgi',
      'Ivanov',
      'basic'
    );
  });
});
