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
import * as moment from 'moment';
import { calculateInstallment } from '../../common/calculate-functions/calculate-func';

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
	public currentData;
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
				this.loanRequests = [];
				querySnapshot.forEach((doc: LoanRequestDTO) => {
					this.loanRequests.push({
						...doc
					});
				});
			})
		);

		this.subscriptions.push(
			this.borrowerService.getUserSuggestions().subscribe((snaphost: LoanSuggestionDTO[]) => {
				this.loanSuggestions = [];
				snaphost.forEach((docs: LoanSuggestionDTO) => {
					this.loanSuggestions.push({
						...docs
					});
				});
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

	public acceptRequest(suggestion: CurrentLoanDTO): void {
		console.log(suggestion);
		this.borrowerService
			.acceptLoanRequest({
				date: moment().format('YYYY-MM-DD'),
				installment: calculateInstallment(
					suggestion.amount,
					suggestion.interestRate,
					suggestion.period
				).toFixed(2),
				...suggestion,
				$userId: this.user.uid,
				status: 'current'
			})
			.then(() => {
				this.borrowerService.getUser(this.user.uid).subscribe((е) => {
					е.forEach((docs) => {
						this.currentData = docs.data();
						this.currentData.totalDebt += suggestion.amount;
						this.currentData.currentBalance += suggestion.amount;
						this.borrowerService.getUserDocData(docs.id).set(
							{
								totalDebt: Number(this.currentData.totalDebt.toFixed(2)),
								currentBalance: Number(this.currentData.currentBalance.toFixed(2))
							},
							{ merge: true }
						);
					});
				});
				this.borrowerService.deleteLoanSuggestion(suggestion.$requestId);
				this.borrowerService.deleteLoanRequest(suggestion.$requestId);
			});
	}

	public rejectSuggestion(suggestionId: string): void {
		this.borrowerService.deleteLoanSuggestion(suggestionId);
	}

	public deleteRequest(requestId: string): void {
		this.borrowerService.deleteLoanSuggestion(requestId);
		this.borrowerService.deleteLoanRequest(requestId);
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
