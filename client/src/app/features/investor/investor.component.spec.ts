import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { LoanRequestDTO } from './../../common/models/loan-request.dto';
import { InvestorService } from './../../core/services/investor.service';
import { InvestorComponent } from './investor.component';
import { AuthenticationService } from './../../core/services/authentication.service';
import { CurrentInvestmentsDTO } from './../../common/models/current-investments.dto';
import { ShowInvestmentComponent } from './show-investment/show-investment.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveLoanRequestsComponent } from './active-loan-requests/active-loan-requests.component';

describe('InvestorComponent', () => {
  let authService;
  let investorService;
  let modalService;

  let testUser;

  let fixture: ComponentFixture<InvestorComponent>;
  let component: InvestorComponent;

  beforeEach(async () => {
    jest.clearAllMocks();

    testUser = {
      uid: '1'
    };

    modalService = {
      open() { }
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
        return of([]);
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
      .overrideProvider(NgbModal, { useValue: modalService })
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

    it('should subscribe to investor.Service.getUserInvestments() once with the correct data', done => {

      const testCurrentInvestment: CurrentInvestmentsDTO = {
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
        status: 'test'
      };

      const spyGetUserInvestments = jest.spyOn(investorService, 'getUserInvestments')
        .mockImplementation(() => of([testCurrentInvestment]));

      component.ngOnInit();

      expect(spyGetUserInvestments).toBeCalledTimes(1);
      expect(component.currentInvestments[0]).toBe(testCurrentInvestment);
      done();
    });
  });

  describe('createShowProposalsModal()', () => {
    it('should call modalService.open() once', () => {


      const testModal = jest
        .spyOn(modalService, 'open')
        .mockImplementation(() => ({
          componentInstance: {createShowProposalsModal: of(testUser)}
        }));

      component.createShowProposalsModal();

      expect(testModal).toBeCalledTimes(1);
    });
  });
});

