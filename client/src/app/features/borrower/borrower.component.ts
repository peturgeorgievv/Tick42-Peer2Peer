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
			querySnapshot.forEach((doc) => {
				this.currentLoans.push({
					id: doc.id,
					...doc.data()
				});
			});
		});

		this.borrowerService.getUserRequests(this.user.uid).subscribe((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				this.loanRequests.push({
					$requestId: doc.id,
					...doc.data()
				});
				// Have to fix! Displaying all suggestions on all requests
				this.borrowerService.getUserSuggestions(doc.id).subscribe((snaphost) => {
					snaphost.forEach((docs) => {
						console.log(docs.data());
						console.log(docs.id);
						this.loanSuggestions.push({
							// $requestId: docs.id,
							...docs.data()
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
				console.log(ref.id);
				this.borrowerService.addRequestIdToLoan(ref.id);
				this.loanRequests.push({
					$requestId: ref.id,
					...loanData
				});
				this.notificatorService.success('Your loan have been added to pending requests!');
			})
			.catch(() => {
				this.notificatorService.error('Oops, something went wrong!');
			});
	}
}
