import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { BorrowerService } from './../../core/services/borrower.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'firebase';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
	selector: 'app-borrower',
	templateUrl: './borrower.component.html',
	styleUrls: [ './borrower.component.css' ]
})
export class BorrowerComponent implements OnInit {
	public addLoanForm: FormGroup;
	public currentLoans = [];
	public loanRequests = [];
	public loanSuggestions = [];
	public user: User;
	private userSubscription: Subscription;

	constructor(
		private readonly borrowerService: BorrowerService,
		public authService: AuthenticationService,
		private readonly formBuilder: FormBuilder,
		private readonly notificatorService: NotificatorService
	) {
		this.userSubscription = this.authService.loggedUser$.subscribe((res) => {
			return (this.user = res);
		});
	}

	public ngOnInit() {
		this.borrowerService.getUserLoans(this.user.uid).subscribe((querySnapshot) => {
			this.currentLoans = [];
			querySnapshot.forEach((doc) => {
				this.currentLoans.push({
					id: doc.payload.doc.id,
					...doc.payload.doc.data()
				});
			});
		});

		this.borrowerService.getUserRequests(this.user.uid).subscribe((querySnapshot) => {
			this.loanRequests = [];

			querySnapshot.forEach((doc) => {
				this.loanRequests.push({
					...doc.payload.doc.data()
				});
			});
		});
		this.borrowerService.getUserSuggestions().subscribe((snaphost) => {
			this.loanSuggestions = [];
			snaphost.forEach((docs) => {
				console.log(docs.payload.doc.data());
				this.loanSuggestions.push({
					...docs.payload.doc.data()
				});
			});
		});

		this.addLoanForm = this.formBuilder.group({
			amount: [ '', [ Validators.required ] ],
			dueDate: [ '', [ Validators.required ] ],
			period: [ '', [ Validators.required ] ]
		});
	}

	public calculateInstallment(amount, interestRate, period) {
		return (amount * interestRate / 100 / period + amount / period).toFixed(2);
	}

	public calculateNextDueDate(dueDate) {
		const currMonth = moment().month();
		const dueDateMonth = moment(dueDate).month();
		const nextDueDate = moment(dueDate).add(currMonth - dueDateMonth + 1, 'M').format('YYYY-MM-DD');
		return nextDueDate;
	}

	public calculateOverdue(dueDate, amount, penalty, interestRate, period) {
		const currDueDate = this.calculateNextDueDate(dueDate);
		const currDateDay = moment().date();
		const currDueDateDay = moment(currDueDate).date();

		const overdue = ((currDateDay - currDueDateDay) *
			penalty *
			Number(this.calculateInstallment(amount, interestRate, period))).toFixed(2);
		return overdue;

		// const currDateMonth = moment().month();
		// const currDueDateMonth = moment(currDueDate).month();
	}

	public acceptRequest(suggestion): void {
		console.log(suggestion);
		this.borrowerService
			.acceptLoanRequest({
				date: moment().format('YYYY-MM-DD'),
				...suggestion,
				$userId: this.user.uid,
				status: 'current'
			})
			.then(() => {
				this.borrowerService.deleteLoanSuggestion(suggestion.$requestId);
				this.borrowerService.deleteLoanRequest(suggestion.$requestId);
			});
	}

	public rejectSuggestion(suggestionId): void {
		this.borrowerService.deleteLoanSuggestion(suggestionId);
	}

	public deleteRequest(requestId): void {
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
