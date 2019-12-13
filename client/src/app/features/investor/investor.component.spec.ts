import { of } from 'rxjs';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { LoanRequestDTO } from './../../common/models/loan-request.dto';
import { InvestorService } from './../../core/services/investor.service';
import { InvestorComponent } from './investor.component';
import { AuthenticationService } from './../../core/services/authentication.service';
import { ShowInvestmentComponent } from './show-investment/show-investment.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveLoanRequestsComponent } from './active-loan-requests/active-loan-requests.component';

describe('InvestorComponent', () => {
  let authService;
  let investorService;

  let testUser;

  let fixture: ComponentFixture<InvestorComponent>;
  let component: InvestorComponent;

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
      }
    };

    investorService = {
      getAllLoanRequests() {
        return of([]);
      },
      getUserInvestments() {
        return of();
      }
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, SharedModule],
      declarations: [
        InvestorComponent,
        ActiveLoanRequestsComponent,
        ShowInvestmentComponent,
      ],
      providers: [
        InvestorService,
        AuthenticationService,
      ]
    })
      .overrideProvider(InvestorService, { useValue: investorService })
      .overrideProvider(AuthenticationService, { useValue: authService })
      .compileComponents();

    jest
      .spyOn(authService, 'loggedUser$', 'get')
      .mockImplementation(() => of(testUser));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit()', () => {
    it('should subscribe to investorService.getAllLoanRequests() once with the correct data', done => {

      const testLoanRequests: LoanRequestDTO = {
        $requestId: '1',
        $userId: '2',
        $userDocId: '1',
        amount: 1,
        period: 1,
        dateSubmited: '12-12-2020',
        partial: true,
        status: ''
      };

      const spyGetAllRequests = jest.spyOn(investorService, 'getAllLoanRequests')
        .mockImplementation(() => of([testLoanRequests]));

      component.ngOnInit();

      expect(spyGetAllRequests).toBeCalledTimes(1);
      expect(component.loanRequests[0]).toBe(testLoanRequests);
      done();
    });
  });
});

