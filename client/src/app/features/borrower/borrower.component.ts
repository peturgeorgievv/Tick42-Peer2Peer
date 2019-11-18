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
	public toggleAddLoan = false;
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
			this.loanSuggestions = [];
			querySnapshot.forEach((doc) => {
				this.loanRequests.push({
					$requestId: doc.payload.doc.id,
					...doc.payload.doc.data()
				});
				this.borrowerService.getUserSuggestions(doc.payload.doc.id).subscribe((snaphost) => {
					snaphost.forEach((docs) => {
						console.log(docs.payload.doc.data());
						this.loanSuggestions.push({
							...docs.payload.doc.data()
						});
					});
					console.log(this.loanSuggestions);
					console.log(this.loanRequests);
				});
			});
		});

		this.addLoanForm = this.formBuilder.group({
			amount: [ '', [ Validators.required ] ],
			dueDate: [ '', [ Validators.required ] ],
			period: [ '', [ Validators.required ] ]
		});
	}

	public acceptRequest(suggestion): void {
		console.log(suggestion);
		this.borrowerService
			.acceptLoanRequest({
				$userId: this.user.uid,
				dueInstallment: moment(new Date()).add(1, 'M').format('YYYY-MM-DD'),
				nextDueDate: moment(new Date()).add(1, 'M').format('YYYY-MM-DD'),
				overdueInstallments: 0,
				installmentLeft: suggestion.amount,
				...suggestion,
				status: 'current'
			})
			.then(() => {
				this.borrowerService.deleteLoanSuggestion(suggestion.$requestId);
				this.borrowerService.deleteLoanRequest(suggestion.$requestId);
			});
	}

	public rejectSuggestion(suggestion): void {
		this.borrowerService.deleteLoanSuggestion(suggestion.$requestId);
	}

	public deleteRequest(requestId): void {
		this.borrowerService.deleteLoanRequest(requestId);
		this.borrowerService.deleteLoanSuggestion(requestId);
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
