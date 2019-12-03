import { CreateLoanModalComponent } from './create-loan-modal/create-loan-modal.component';
import { UserDTO } from './../../common/models/users/user-data.dto';
import { StatusENUM } from './../../common/enums/status.enum';
import { CurrentLoanDTO } from './../../common/models/current-loan.dto';
import { AllPaymentsDTO } from './../../common/models/all-payments.dto';
import { LoanSuggestionDTO } from './../../common/models/loan-suggestion.dto';
import { LoanRequestDTO } from './../../common/models/loan-request.dto';
import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { BorrowerService } from './../../core/services/borrower.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'firebase';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-borrower',
	templateUrl: './borrower.component.html',
	styleUrls: [ './borrower.component.css' ]
})
export class BorrowerComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];

	public currentLoans: CurrentLoanDTO[] = [];
	public loanRequests: LoanRequestDTO[] = [];
	public loanSuggestions: LoanSuggestionDTO[] = [];

	public user: User;

	public allPayments: AllPaymentsDTO[] = [];
	public amountPaid = 0;

	constructor(
		private readonly borrowerService: BorrowerService,
		private readonly notificatorService: NotificatorService,
		private readonly authService: AuthenticationService,
		private readonly modalService: NgbModal
	) {
		this.subscriptions.push(
			this.authService.loggedUser$.subscribe((res) => {
				return (this.user = res);
			})
		);
	}

	public ngOnInit(): void {
		this.subscriptions.push(
			this.borrowerService.getUserLoans(this.user.uid).subscribe((querySnapshot: CurrentLoanDTO[]) => {
				this.currentLoans = querySnapshot;
			})
		);

		this.orderLoansAsc('amount');

		this.subscriptions.push(
			this.borrowerService.getUserSuggestions().subscribe((snaphost: LoanSuggestionDTO[]) => {
				this.loanSuggestions = snaphost;
			})
		);

		this.subscriptions.push(
			this.borrowerService.getAllPayments(this.user.uid).subscribe((snapshot: AllPaymentsDTO[]) => {
				this.allPayments = snapshot;
			})
		);
	}

	public ngOnDestroy(): void {
		this.subscriptions.forEach((subscription) => subscription.unsubscribe());
	}

	createLoanRequestModal(): void {
		const createLoanRequestModal = this.modalService.open(CreateLoanModalComponent);
		createLoanRequestModal.componentInstance.createLoanRequest.subscribe((loanData) => {
			this.borrowerService
				.createLoanRequest({
					$userId: this.user.uid,
					status: StatusENUM.requestOpen,
					...loanData
				})
				.then((ref) => {
					this.borrowerService.addRequestIdToLoan(ref.id);
					this.notificatorService.success('Your request have been added to pending!');
				})
				.catch(() => {
					this.notificatorService.error('Oops, something went wrong!');
				});
		});
	}

	public orderLoansAsc(property: string): void {
		this.subscriptions.push(
			this.borrowerService
				.getUserRequestsAsc(this.user.uid, property)
				.subscribe((querySnapshot: LoanRequestDTO[]) => {
					this.loanRequests = querySnapshot;
				})
		);
	}

	public orderLoansDesc(property: string): void {
		this.subscriptions.push(
			this.borrowerService
				.getUserRequestsDesc(this.user.uid, property)
				.subscribe((querySnapshot: LoanRequestDTO[]) => {
					this.loanRequests = querySnapshot;
				})
		);
	}
}
