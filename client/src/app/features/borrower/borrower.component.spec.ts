import { LoanRequestDTO } from './../../common/models/loan-request.dto';
import { AllPaymentsDTO } from './../../common/models/all-payments.dto';
import { LoanSuggestionDTO } from './../../common/models/loan-suggestion.dto';
import { CurrentLoanDTO } from './../../common/models/current-loan.dto';
import { SharedModule } from './../../shared/shared.module';
import { BorrowerService } from './../../core/services/borrower.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { BorrowerComponent } from './borrower.component';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CreateLoanModalComponent } from './create-loan-modal/create-loan-modal.component';
import { CurrentLoanComponent } from './current-loan/current-loan.component';
import { LoanRequestsComponent } from './loan-requests/loan-requests.component';

describe('BorrowerComponent', () => {
  let authService;
  let notificatorService;
  let modalService;
  let borrowerService;
  let mockedUser;

  let fixture: ComponentFixture<BorrowerComponent>;
  let component: BorrowerComponent;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockedUser = {
      uid: '1'
    };

    authService = {
      get loggedUser$() {
        return of();
      },
      get userBalanceDataSubject$() {
        return of();
      }
    };

    modalService = {
      open() {}
    };

    notificatorService = {
      success() {},
      error() {}
    };

    borrowerService = {
      getUserLoans() {
        return of();
      },
      getUserSuggestions() {
        return of();
      },
      getAllPayments() {
        return of();
      },
      createLoanRequest() {
        return of();
      },
      addRequestIdToLoan() {
        return of();
      },
      getUserRequestsAsc() {
        return of();
      },
      getUserRequestsDesc() {
        return of();
      }
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, SharedModule],
      declarations: [
        BorrowerComponent,
        CreateLoanModalComponent,
        CurrentLoanComponent,
        LoanRequestsComponent
      ],
      providers: [
        BorrowerService,
        AuthenticationService,
        NotificatorService,
        NgbModal
      ]
    })
      .overrideProvider(BorrowerService, { useValue: borrowerService })
      .overrideProvider(AuthenticationService, { useValue: authService })
      .overrideProvider(NotificatorService, { useValue: notificatorService })
      .overrideProvider(NgbModal, { useValue: modalService })
      .compileComponents();

    fixture = TestBed.createComponent(BorrowerComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();

    jest
      .spyOn(authService, 'loggedUser$', 'get')
      .mockImplementation(() => of(mockedUser));
  });

  it('should be defined', () => {
    // Arrange & Act & Assert
    expect(component).toBeDefined();
  });

  describe('ngOnInit()', () => {
    it('should subscribe to borrowerService.getUserLoans and return correct data', done => {
      // Arrange
      const mockedLoansData: CurrentLoanDTO = {
        $requestId: '1',
        $investorId: '1',
        $investorDocId: '1',
        $suggestionId: '1',
        $userId: '1',
        $userDocId: '1',
        amount: 1,
        date: '12-12-2020',
        installment: 1,
        interestRate: 1,
        penalty: 1,
        period: 1,
        status: 'current'
      };
      const mockedLoans: CurrentLoanDTO[] = [mockedLoansData];

      const spyUserLoans = jest
        .spyOn(borrowerService, 'getUserLoans')
        .mockImplementation(() =>
          of(mockedLoans).subscribe(data => {
            expect(data).toBe(mockedLoans);
            done();
          })
        );

      // Act
      component.ngOnInit();

      // Assert
      expect(spyUserLoans).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to borrowerService.getUserSuggestions and return correct data', done => {
      // Arrange
      const mockedLoanSuggestions: LoanSuggestionDTO = {
        $requestId: '1',
        $investorId: '1',
        $investorDocId: '1',
        $suggestionId: '1',
        $userId: '1',
        dateSubmited: '12-12-2020',
        amount: 1,
        interestRate: 1,
        penalty: 1,
        period: 1,
        status: 'current'
      };
      const mockedLoanSuggestionsData: LoanSuggestionDTO[] = [
        mockedLoanSuggestions
      ];

      const spyUserLoanSuggestions = jest
        .spyOn(borrowerService, 'getUserSuggestions')
        .mockImplementation(() =>
          of(mockedLoanSuggestionsData).subscribe(data => {
            expect(data).toBe(mockedLoanSuggestionsData);
            done();
          })
        );

      // Act
      component.ngOnInit();

      // Assert
      expect(spyUserLoanSuggestions).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to borrowerService.getAllPayments and return correct data', done => {
      // Arrange
      const mockedLoanPayments: AllPaymentsDTO = {
        $requestId: '1',
        $investorId: '1',
        $investorDocId: '1',
        $suggestionId: '1',
        $userId: '1',
        amount: 1,
        date: '12-12-2020',
        overdue: 0
      };
      const mockedLoanPaymentsData: AllPaymentsDTO[] = [mockedLoanPayments];

      const spyUserLoanPayments = jest
        .spyOn(borrowerService, 'getAllPayments')
        .mockImplementation(() =>
          of(mockedLoanPaymentsData).subscribe(data => {
            expect(data).toBe(mockedLoanPaymentsData);
            done();
          })
        );

      // Act
      component.ngOnInit();

      // Assert
      expect(spyUserLoanPayments).toHaveBeenCalledTimes(1);
    });
  });

  describe('createLoanRequestModal()', () => {
    it('should call modalService.open once', () => {
      // Arrange
      const mockedLoanRequest = new LoanRequestDTO();

      const spyUserLoanRequests = jest
        .spyOn(borrowerService, 'createLoanRequest')
        .mockImplementation(() => of(mockedLoanRequest));

      const spyModal = jest
        .spyOn(modalService, 'open')
        .mockImplementation(() => ({
          componentInstance: {
            createLoanRequest: of(mockedLoanRequest)
          }
        }));

      // Act
      component.createLoanRequestModal();

      // Assert

      expect(spyModal).toBeCalledTimes(1);
    });
  });

  describe('orderLoansAsc()', () => {
    it('should call borrowerService.getUserRequestsAsc once', done => {
      // Arrange
      const property = 'asc';
      const mockedLoanRequest: LoanRequestDTO = {
        $requestId: '1',
        $userId: '1',
        $userDocId: '1',
        amount: 1,
        period: 1,
        dateSubmited: '12-12-2020',
        partial: true,
        status: 'loan-request'
      };
      jest.spyOn(borrowerService, 'getUserLoans').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );
      jest.spyOn(borrowerService, 'getUserSuggestions').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );
      jest.spyOn(borrowerService, 'getAllPayments').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );

      const mockedLoanRequestData: LoanRequestDTO[] = [mockedLoanRequest];
      component.user = mockedUser as any;
      const spyUserLoanRequests = jest
        .spyOn(borrowerService, 'getUserRequestsAsc')
        .mockImplementation(() => of(mockedLoanRequestData));
      // Act
      component.ngOnInit();
      component.orderLoansAsc(property);

      // Assert
      expect(spyUserLoanRequests).toHaveBeenCalledTimes(1);
    });

    it('should call borrowerService.getUserRequestsAsc and assign loanRequests', done => {
      // Arrange
      const property = 'asc';
      const mockedLoanRequest: LoanRequestDTO = {
        $requestId: '1',
        $userId: '1',
        $userDocId: '1',
        amount: 1,
        period: 1,
        dateSubmited: '12-12-2020',
        partial: true,
        status: 'loan-request'
      };
      jest.spyOn(borrowerService, 'getUserLoans').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );
      jest.spyOn(borrowerService, 'getUserSuggestions').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );
      jest.spyOn(borrowerService, 'getAllPayments').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );

      const mockedLoanRequestData: LoanRequestDTO[] = [mockedLoanRequest];
      component.user = mockedUser as any;
      const spyUserLoanRequests = jest
        .spyOn(borrowerService, 'getUserRequestsAsc')
        .mockImplementation(() => of(mockedLoanRequestData));
      // Act
      component.ngOnInit();
      component.orderLoansAsc(property);

      // Assert
      expect(component.loanRequests).toBe(mockedLoanRequestData);
    });
  });

  describe('orderLoansDesc()', () => {
    it('should call borrowerService.getUserRequestsDesc once', done => {
      // Arrange
      const property = 'desc';
      const mockedLoanRequest: LoanRequestDTO = {
        $requestId: '1',
        $userId: '1',
        $userDocId: '1',
        amount: 1,
        period: 1,
        dateSubmited: '12-12-2020',
        partial: true,
        status: 'loan-request'
      };
      jest.spyOn(borrowerService, 'getUserLoans').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );
      jest.spyOn(borrowerService, 'getUserSuggestions').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );
      jest.spyOn(borrowerService, 'getAllPayments').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );

      const mockedLoanRequestData: LoanRequestDTO[] = [mockedLoanRequest];
      component.user = mockedUser as any;
      const spyUserLoanRequests = jest
        .spyOn(borrowerService, 'getUserRequestsDesc')
        .mockImplementation(() => of(mockedLoanRequestData));
      // Act
      component.ngOnInit();
      component.orderLoansDesc(property);

      // Assert
      expect(spyUserLoanRequests).toHaveBeenCalledTimes(1);
    });

    it('should call borrowerService.getUserRequestsDesc and assign loanRequests', done => {
      // Arrange
      const property = 'asc';
      const mockedLoanRequest: LoanRequestDTO = {
        $requestId: '1',
        $userId: '1',
        $userDocId: '1',
        amount: 1,
        period: 1,
        dateSubmited: '12-12-2020',
        partial: true,
        status: 'loan-request'
      };
      jest.spyOn(borrowerService, 'getUserLoans').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );
      jest.spyOn(borrowerService, 'getUserSuggestions').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );
      jest.spyOn(borrowerService, 'getAllPayments').mockImplementation(() =>
        of(1).subscribe(data => {
          expect(data).toBe(1);
          done();
        })
      );

      const mockedLoanRequestData: LoanRequestDTO[] = [mockedLoanRequest];
      component.user = mockedUser as any;
      const spyUserLoanRequests = jest
        .spyOn(borrowerService, 'getUserRequestsDesc')
        .mockImplementation(() => of(mockedLoanRequestData));
      // Act
      component.ngOnInit();
      component.orderLoansDesc(property);

      // Assert
      expect(component.loanRequests).toBe(mockedLoanRequestData);
    });
  });
});
