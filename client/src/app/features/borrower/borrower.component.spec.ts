import { CurrentLoanDTO } from './../../common/models/current-loan.dto';
import { SharedModule } from './../../shared/shared.module';
import { BorrowerService } from './../../core/services/borrower.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { BorrowerComponent } from './borrower.component';
import { of } from 'rxjs';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CreateLoanModalComponent } from './create-loan-modal/create-loan-modal.component';
import { CurrentLoanComponent } from './current-loan/current-loan.component';
import { LoanRequestsComponent } from './loan-requests/loan-requests.component';

describe('BorrowerComponent', () => {
	let authService;
	let notificatorService;
	let modalService;
	let borrowerService;

	let fixture: ComponentFixture<BorrowerComponent>;
	let component: BorrowerComponent;

	beforeEach(() => {
		jest.clearAllMocks();

		authService = {
			get loggedUser$() {
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
			getUserLoans() {},
			getUserSuggestions() {},
			getAllPayments() {},
			createLoanRequest() {},
			addRequestIdToLoan() {},
			getUserRequestsAsc() {},
			getUserRequestsDesc() {}
		};

		TestBed.configureTestingModule({
			imports: [ CommonModule, SharedModule ],
			declarations: [ BorrowerComponent, CreateLoanModalComponent, CurrentLoanComponent, LoanRequestsComponent ],
			providers: [ BorrowerService, AuthenticationService, NotificatorService, NgbModal ]
		})
			.overrideProvider(BorrowerService, { useValue: borrowerService })
			.overrideProvider(AuthenticationService, { useValue: authService })
			.overrideProvider(NotificatorService, { useValue: notificatorService })
			.overrideProvider(NgbModal, { useValue: modalService })
			.compileComponents()
			.then(() => {
				fixture = TestBed.createComponent(BorrowerComponent);
				component = fixture.componentInstance;
			});
	});

	it('should be defined', () => {
		// Arrange & Act & Assert
		expect(component).toBeDefined();
	});

	describe('ngOnInit()', () => {
		it('should subscribe to the borrowerService.getUserLoans once', () => {
			// Arrange
			const mockedLoansData: CurrentLoanDTO = {
				$requestId: '1',
				$investorId: '1',
				$investorDocId: '1',
				$suggestionId: '1',
				$userId: '1',
				amount: 1,
				date: '12-12-2020',
				installment: 1,
				interestRate: 1,
				penalty: 1,
				period: 1,
				status: 'current'
			};
			const mockedLoans: CurrentLoanDTO[] = [ mockedLoansData ];
			const spy = jest.spyOn(borrowerService, 'getUserLoans').mockReturnValue(of(mockedLoans));

			// Act
			component.ngOnInit();

			// Assert
			expect(spy).toHaveBeenCalledTimes(1);
		});

		// it('should set the loggedUserData field with the passed value', () => {
		//   // Arrange
		//   const mockedUser = 'mocked user';
		//   const spy = jest
		//     .spyOn(authService, 'loggedUserData$', 'get')
		//     .mockReturnValue(of(mockedUser));

		//   // Act
		//   component.ngOnInit();

		//   // Assert
		//   expect(component.loggedUserData).toEqual(mockedUser);
		// });

		// it('should set the loggedUserData field with the passed value', () => {
		//   // Arrange
		//   const mockedUser = 'mocked user';
		//   const spy = jest
		//     .spyOn(authService, 'loggedUserData$', 'get')
		//     .mockReturnValue(of(mockedUser));

		//   // Act
		//   component.ngOnInit();

		//   // Assert
		//   expect((component as any).loggedUserSubscription).toBeDefined();
		// });
	});
});
