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
import {
	calculateInstallment,
	calculateNextDueDate,
	calculateOverdue,
	calculateEndOfContractDate
} from '../../common/calculate-functions/calculate-func';

@Component({
	selector: 'app-borrower',
	templateUrl: './borrower.component.html',
	styleUrls: [ './borrower.component.css' ]
})
export class BorrowerComponent implements OnInit, OnDestroy {
	private userSubscription: Subscription;
	private userLoansSubscription: Subscription;
	private userRequestsSubscription: Subscription;
	private userSuggestionsSubscription: Subscription;
	private userPaymentsSubscription: Subscription;

	public addLoanForm: FormGroup;
	public currentLoans = [];
	public loanRequests: LoanRequestDTO[] = [];
	public loanSuggestions: LoanSuggestionDTO[] = [];

	public userDocData;
	public user: User;

	public loanFullData;
	public paymentsData: AllPaymentsDTO[] = [];
	public allPayments: AllPaymentsDTO[] = [];
	public currentData;
	public amountPaid = 0;

	constructor(
		private readonly borrowerService: BorrowerService,
		private readonly notificatorService: NotificatorService,
		private readonly formBuilder: FormBuilder,
		public authService: AuthenticationService
	) {
		this.userSubscription = this.authService.loggedUser$.subscribe((res) => {
			return (this.user = res);
		});
	}

	public ngOnInit(): void {
		this.userLoansSubscription = this.borrowerService.getUserLoans(this.user.uid).subscribe((querySnapshot) => {
			this.currentLoans = [];
			querySnapshot.forEach((doc) => {
				const currentUser: any = doc.payload.doc.data();
				this.borrowerService.getUser(currentUser.$investorId).subscribe((е) => {
					е.forEach((docs) => {
						this.userDocData = docs.data();
					});
					this.currentLoans.push({
						id: doc.payload.doc.id,
						email: this.userDocData.email,
						...doc.payload.doc.data()
					});
				});
			});
		});

		this.userRequestsSubscription = this.borrowerService
			.getUserRequests(this.user.uid)
			.subscribe((querySnapshot: LoanRequestDTO[]) => {
				this.loanRequests = [];
				querySnapshot.forEach((doc: LoanRequestDTO) => {
					this.loanRequests.push({
						...doc
					});
				});
			});

		this.userSuggestionsSubscription = this.borrowerService
			.getUserSuggestions()
			.subscribe((snaphost: LoanSuggestionDTO[]) => {
				this.loanSuggestions = [];
				snaphost.forEach((docs: LoanSuggestionDTO) => {
					this.loanSuggestions.push({
						...docs
					});
				});
			});

		this.userPaymentsSubscription = this.borrowerService
			.getAllPayments(this.user.uid)
			.subscribe((snaphost: AllPaymentsDTO[]) => {
				this.allPayments = [];
				snaphost.forEach((docs: AllPaymentsDTO) => {
					this.allPayments.push({
						...docs
					});
				});
			});

		this.addLoanForm = this.formBuilder.group({
			amount: [ '', [ Validators.required ] ],
			dueDate: [ '', [ Validators.required ] ],
			period: [ '', [ Validators.required ] ]
		});
	}

	public ngOnDestroy(): void {
		this.userSubscription.unsubscribe();
		this.userLoansSubscription.unsubscribe();
		this.userRequestsSubscription.unsubscribe();
		this.userSuggestionsSubscription.unsubscribe();
		this.userPaymentsSubscription.unsubscribe();
	}

	public endOfContract(dueDate: string, period: number): string {
		return calculateEndOfContractDate(dueDate, period);
	}

	public calcNextDueDate(dueDate: string, payments: number): string {
		return calculateNextDueDate(dueDate, payments);
	}

	public calcOverdue(
		dueDate: string,
		amount: number,
		penalty: number,
		interestRate: number,
		period: number,
		payments: number
	): number {
		return calculateOverdue(dueDate, amount, penalty, interestRate, period, payments);
	}

	public loanData(obj: CurrentLoanDTO) {
		return (this.loanFullData = obj);
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

	public sumOfHistoryAmounts(obj: CurrentLoanDTO) {
		return this.allPayments.reduce((acc, data) => {
			if (data.$requestId === obj.$requestId) {
				return (acc += data.amount);
			}
			return acc;
		}, 0);
	}

	public historyAmountsLength(obj: CurrentLoanDTO) {
		return this.allPayments.reduce((acc, data) => {
			if (data.$requestId === obj.$requestId) {
				return (acc += 1);
			}
			return acc;
		}, 0);
	}

	public rejectSuggestion(suggestionId: string): void {
		this.borrowerService.deleteLoanSuggestion(suggestionId);
	}

	public getPayments(reqId: string, userId: string) {
		this.borrowerService.getPayments(reqId, userId).subscribe((querySnapshot: AllPaymentsDTO[]) => {
			this.paymentsData = [];
			this.amountPaid = 0;
			querySnapshot.forEach((doc: AllPaymentsDTO) => {
				this.paymentsData.push(doc);
			});
			this.paymentsData.map((data) => (this.amountPaid += data.amount));
			return this.amountPaid;
		});
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

	public createPayment(data: AllPaymentsDTO): void {
		this.borrowerService
			.createPayment({
				...data
			})
			.then(() => {
				this.borrowerService.getUser(this.user.uid).subscribe((е) => {
					е.forEach((docs) => {
						this.currentData = docs.data();
						this.currentData.totalDebt -= data.amount;
						this.currentData.currentBalance -= data.amount;
						this.borrowerService.getUserDocData(docs.id).set(
							{
								totalDebt: +this.currentData.totalDebt.toFixed(2),
								currentBalance: +this.currentData.currentBalance.toFixed(2)
							},
							{ merge: true }
						);
					});
				});
				this.notificatorService.success('You have paid successefully!');
			})
			.catch(() => this.notificatorService.error('Oops, something went wrong!'));
	}
}
