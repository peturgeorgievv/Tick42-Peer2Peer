import { CurrentLoanDTO } from './../../common/models/current-loan.dto';
import { AllPaymentsDTO } from './../../common/models/all-payments.dto';
import { LoanSuggestionDTO } from './../../common/models/loan-suggestion.dto';
import { LoanRequestDTO } from './../../common/models/loan-request.dto';
import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { BorrowerService } from './../../core/services/borrower.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'firebase';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-borrower',
	templateUrl: './borrower.component.html',
	styleUrls: [ './borrower.component.css' ]
})
export class BorrowerComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];

	public addLoanForm: FormGroup;
	public currentLoans = [];
	public loanRequests: LoanRequestDTO[] = [];
	public loanSuggestions: LoanSuggestionDTO[] = [];

	public userDocData;
	public user: User;

	public loanFullData;
	public allPayments: AllPaymentsDTO[] = [];
	public amountPaid = 0;

	constructor(
		private readonly borrowerService: BorrowerService,
		private readonly notificatorService: NotificatorService,
		private readonly formBuilder: FormBuilder,
		public authService: AuthenticationService
	) {
		this.subscriptions.push(
			this.authService.loggedUser$.subscribe((res) => {
				return (this.user = res);
			})
		);
	}

	public ngOnInit(): void {
		this.subscriptions.push(
			this.borrowerService.getUserLoans(this.user.uid).subscribe((querySnapshot) => {
				this.currentLoans = [];
				querySnapshot.forEach((doc) => {
					const currentUser: any = doc;
					this.borrowerService.getUser(currentUser.$investorId).subscribe((е) => {
						е.forEach((docs) => {
							this.userDocData = docs.data();
							this.currentLoans.push({
								email: this.userDocData.email,
								...doc
							});
						});
					});
				});
			})
		);

		this.subscriptions.push(
			this.borrowerService.getUserRequests(this.user.uid).subscribe((querySnapshot: LoanRequestDTO[]) => {
				this.loanRequests = querySnapshot;
				console.log(querySnapshot);
			})
		);

		this.subscriptions.push(
			this.borrowerService.getUserSuggestions().subscribe((snaphost: LoanSuggestionDTO[]) => {
				this.loanSuggestions = snaphost;
				console.log(this.loanSuggestions);
			})
		);

		this.subscriptions.push(
			this.borrowerService.getAllPayments(this.user.uid).subscribe((snaphost: AllPaymentsDTO[]) => {
				this.allPayments = [];
				snaphost.forEach((docs: AllPaymentsDTO) => {
					this.allPayments.push({
						...docs
					});
				});
			})
		);

		this.addLoanForm = this.formBuilder.group({
			amount: [ '', [ Validators.required ] ],
			dueDate: [ '', [ Validators.required ] ],
			period: [ '', [ Validators.required ] ]
		});
	}

	public ngOnDestroy(): void {
		this.subscriptions.forEach((subscription) => subscription.unsubscribe());
	}

	public createLoanReq(loanData): void {
		this.borrowerService
			.createLoanRequest({
				$userId: this.user.uid,
				status: 'request',
				...loanData
			})
			.then((ref) => {
				this.borrowerService.addRequestIdToLoan(ref.id);
				this.notificatorService.success('Your loan have been added to pending requests!');
			})
			.catch(() => {
				this.notificatorService.error('Oops, something went wrong!');
			});
	}
}
