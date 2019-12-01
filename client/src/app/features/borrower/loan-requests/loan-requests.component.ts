import { AuthenticationService } from './../../../core/services/authentication.service';
import { UserDTO } from './../../../common/models/users/user-data.dto';
import { StatusENUM } from './../../../common/enums/status.enum';
import { Subscription } from 'rxjs';
import { LoanSuggestionDTO } from './../../../common/models/loan-suggestion.dto';
import { User } from 'firebase';
import { BorrowerService } from './../../../core/services/borrower.service';
import { LoanRequestDTO } from './../../../common/models/loan-request.dto';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { calculateInstallment, overallAmount } from '../../../common/calculate-functions/calculate-func';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-loan-requests',
	templateUrl: './loan-requests.component.html',
	styleUrls: [ './loan-requests.component.css' ]
})
export class LoanRequestsComponent implements OnInit, OnDestroy {
	@Input() loanRequestData: LoanRequestDTO;
	@Input() loanSuggestions: LoanRequestDTO;
	@Input() user: User;
	public userBalanceData: UserDTO;

	public rejectLoanRequestSubscription: Subscription;
	public findPartialRequestLoansSubscription: Subscription;

	public amount: number;
	public period: number;
	public totalAmount: number;
	public dateSubmited: string;
	public partial: boolean;
	public amountLeftToInvest = 0;
	public $requestId: string;
	public edit = false;
	public editLoanForm: FormGroup;

	constructor(
		private readonly borrowerService: BorrowerService,
		private readonly formBuilder: FormBuilder,
		private readonly authService: AuthenticationService
	) {}

	ngOnInit() {
		this.amount = this.loanRequestData.amount;
		this.period = this.loanRequestData.period;
		this.partial = this.loanRequestData.partial;
		this.$requestId = this.loanRequestData.$requestId;
		this.dateSubmited = this.loanRequestData.dateSubmited;

		if (this.loanRequestData.$requestId && this.partial) {
			this.findPartialRequestLoansSubscription = this.borrowerService
				.findPartialRequestLoans(this.loanRequestData.$requestId)
				.subscribe((data: LoanRequestDTO[]) => {
					this.amountLeftToInvest = this.amount;
					data.forEach((loan) => {
						if (loan.amount) {
							this.amountLeftToInvest -= loan.amount;
						}
					});
				});
		}

		this.editLoanForm = this.formBuilder.group({
			amount: [ this.amount, [ Validators.required, Validators.min(this.editFormValidation()) ] ]
		});

		this.authService.userBalanceDataSubject$.subscribe((res) => {
			this.userBalanceData = res;
		});
	}

	ngOnDestroy() {
		if (this.rejectLoanRequestSubscription) {
			this.rejectLoanRequestSubscription.unsubscribe();
		}
		if (this.findPartialRequestLoansSubscription) {
			this.findPartialRequestLoansSubscription.unsubscribe();
		}
	}

	public calculateTotalAmount(amount: number, interestRate: number, period: number) {
		return (this.totalAmount = overallAmount(amount, interestRate, period));
	}

	public editFormValidation() {
		if (this.partial && this.amountLeftToInvest) {
			console.log(this.amount - this.amountLeftToInvest);
			return this.amount - this.amountLeftToInvest;
		}
		return 0;
	}

	public resetForm() {
		this.edit = !this.edit;
		this.editLoanForm.setValue({ amount: this.amount });
	}

	public editLoanRequest(data): void {
		this.edit = false;
		this.borrowerService.editRequestAmount(this.$requestId, data.amount).then(() => {
			this.rejectLoanRequestSubscription = this.borrowerService.rejectBiggerLoanSuggestions(
				this.$requestId,
				data.amount
			);
		});
	}

	public deleteRequest(): void {
		this.borrowerService.rejectLoanSuggestions(this.$requestId);
		this.borrowerService.rejectLoanRequests(this.$requestId);
	}

	public rejectSuggestion(suggestionId: string): void {
		this.borrowerService.rejectLoanSuggestions(suggestionId);
	}

	public acceptRequest(suggestion: LoanSuggestionDTO): void {
		console.log(this.partial);
		console.log(suggestion);
		console.log(this.amountLeftToInvest);

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
				status: StatusENUM.current
			})
			.then(() => {
				const balance = (this.userBalanceData.currentBalance += suggestion.amount);
				this.borrowerService.getUserDocData(this.userBalanceData.$userDocId).set(
					{
						currentBalance: Number(balance.toFixed(2))
					},
					{ merge: true }
				);

				this.borrowerService.getUserDocData(suggestion.$investorDocId).get().subscribe((userData) => {
					const userBalanceData = userData.data();
					const investorBalance = (userBalanceData.currentBalance -= suggestion.amount);
					this.borrowerService.getUserDocData(suggestion.$investorDocId).set(
						{
							currentBalance: Number(investorBalance.toFixed(2))
						},
						{ merge: true }
					);
				});
				if (this.partial && this.amountLeftToInvest - suggestion.amount > 0) {
					this.borrowerService.findLoanSuggestion(suggestion.$suggestionId);
					this.borrowerService.rejectBiggerLoanSuggestions(suggestion.$requestId, this.amountLeftToInvest);
				} else {
					this.borrowerService.findLoanSuggestion(suggestion.$suggestionId);
					this.borrowerService.rejectLoanSuggestions(suggestion.$requestId);
					this.borrowerService.rejectLoanRequests(suggestion.$requestId);
				}
			});
	}
}
