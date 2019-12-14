import { of } from 'rxjs';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { DashboardService } from './../../core/services/dashboard.service';
import { DashboardComponent } from './dashboard.component';
import { FusionChartsModule } from 'angular-fusioncharts';
import { CurrentInvestmentsDTO } from './../../common/models/current-investments.dto';
import { AuthenticationService } from './../../core/services/authentication.service';
import { DashboardRouterModule } from './dashboard-routing.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('DashboardComponent', () => {
  let dashboardService;
  let authService;

  let testUser;

  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;

  beforeEach(async () => {
    jest.clearAllMocks();

    testUser = {
      uid: '1'
    };

    authService = {
      get loggedUser$() {
        return of(testUser);
      },
      get userBalanceDataSubject$() {
        return of();
      },
      getNextDueDate() {
        return of();
      }
    };

    dashboardService = {
      getUserDocData() {
        return of();
      },
      addOrRemoveMoney() {
        return of();
      },
      getCurrentUserInvestments() {
        return of([]);
      },
      getCurrentUserLoans() {
        return of([]);
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SharedModule,
        DashboardRouterModule,
        FusionChartsModule,
      ],
      declarations: [
        DashboardComponent,
      ],
      providers: [
        DashboardService,
        AuthenticationService,
      ]
    })
      .overrideProvider(DashboardService, { useValue: dashboardService })
      .overrideProvider(AuthenticationService, { useValue: authService })
      .compileComponents();

    jest
      .spyOn(authService, 'loggedUser$', 'get')
      .mockImplementation(() => of(testUser));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit()', () => {
    it('should subscribe to dashBoardService.getCurrentUserLoans() once with the correct data', done => {

      const testLoans: CurrentInvestmentsDTO = {
        $investorDocId: 'test',
        $investorId: 'test',
        $requestId: 'test',
        $suggestionId: 'test',
        $userDocId: 'test',
        $userId: 'test',
        amount: 1,
        date: 'test',
        dateSubmited: 'test',
        installment: 'test',
        interestRate: 1,
        penalty: 1,
        period: 1,
        status: 'test',
      };

      const spyGetCurUserLoans = jest
      .spyOn(dashboardService, 'getCurrentUserLoans')
      .mockImplementation(() => of([testLoans]));

      component.ngOnInit();

      expect(spyGetCurUserLoans).toBeCalledTimes(1);
      expect(component.curLoans[0]).toBe(testLoans);
      done();
    });

    it('should subscribe to dashBoardService.getCurrentUserInvestments() once with the correct data', done => {

      const testInvestments: CurrentInvestmentsDTO = {
        $investorDocId: 'test',
        $investorId: 'test',
        $requestId: 'test',
        $suggestionId: 'test',
        $userDocId: 'test',
        $userId: 'test',
        amount: 1,
        date: 'test',
        dateSubmited: 'test',
        installment: 'test',
        interestRate: 1,
        penalty: 1,
        period: 1,
        status: 'test',
      };

      const spyGetCurUserInvestments = jest
      .spyOn(dashboardService, 'getCurrentUserInvestments')
      .mockImplementation(() => of([testInvestments]));

      component.ngOnInit();

      expect(spyGetCurUserInvestments).toBeCalledTimes(1);
      expect(component.curInvestments[0]).toBe(testInvestments);
      done();
    });
  });
});


