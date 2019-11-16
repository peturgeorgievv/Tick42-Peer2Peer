import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { BorrowerService } from './../../core/services/borrower.service';
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'firebase';
import { LoanRequestDTO } from 'src/app/common/models/loan-request.dto';
import { Subscription } from 'rxjs';

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
				console.log(doc.data());
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
							$requestId: docs.id,
							...docs.data()
						});
					});
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
				dueInstallment: new Date().toLocaleDateString(),
				nextDueDate: new Date().toLocaleDateString(),
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
		console.log(loanData);
		this.borrowerService
			.createLoanRequest({
				$userId: this.user.uid,
				status: 'request',
				...loanData
			})
			.then(() => {
				this.toggleAddLoan = !this.toggleAddLoan;
				this.loanRequests.push({
					$userId: this.user.uid,
					status: 'request',
					...loanData
				});
				this.notificatorService.success('Your loan have been added to pending requests!');
			})
			.catch(() => {
				this.notificatorService.error('Oops, something went wrong!');
			});
	}
}
