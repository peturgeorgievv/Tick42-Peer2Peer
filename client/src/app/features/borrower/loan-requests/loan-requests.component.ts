import { StatusENUM } from './../../../common/enums/status.enum';
import { Subscription } from 'rxjs';
import { LoanSuggestionDTO } from './../../../common/models/loan-suggestion.dto';
import { User } from 'firebase';
import { BorrowerService } from './../../../core/services/borrower.service';
import { LoanRequestDTO } from './../../../common/models/loan-request.dto';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { calculateInstallment } from '../../../common/calculate-functions/calculate-func';
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

	public rejectLoanRequestSubscription: Subscription;

	public amount: number;
	public period: number;
	public partial: boolean;
	public $requestId: string;
	public edit = false;
	public editLoanForm: FormGroup;

	constructor(private readonly borrowerService: BorrowerService, private readonly formBuilder: FormBuilder) {}

	ngOnInit() {
		this.amount = this.loanRequestData.amount;
		this.period = this.loanRequestData.period;
		this.partial = this.loanRequestData.partial;
		this.$requestId = this.loanRequestData.$requestId;

		this.editLoanForm = this.formBuilder.group({
			amount: [ this.amount, [ Validators.required ] ]
		});
	}

	ngOnDestroy() {
		if (this.rejectLoanRequestSubscription) {
			this.rejectLoanRequestSubscription.unsubscribe();
		}
	}

	public editLoanRequest(data): void {
		this.edit = false;
		this.borrowerService.editRequestAmount(this.$requestId, data.amount);
		this.rejectLoanRequestSubscription = this.borrowerService.rejectBiggerLoanSuggestions(
			this.$requestId,
			data.amount
		);
	}

	public deleteRequest(): void {
		this.borrowerService.rejectLoanSuggestions(this.$requestId);
		this.borrowerService.rejectLoanRequests(this.$requestId);
	}

	public rejectSuggestion(suggestionId: string): void {
		this.borrowerService.rejectLoanSuggestions(suggestionId);
	}

	public acceptRequest(suggestion: LoanSuggestionDTO): void {
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
				this.borrowerService.getUser(this.user.uid).subscribe((data) => {
					let currentData;
					data.forEach((docs) => {
						currentData = docs.data();
						currentData.totalDebt += suggestion.amount;
						currentData.currentBalance += suggestion.amount;
						this.borrowerService.getUserDocData(docs.id).set(
							{
								totalDebt: Number(currentData.totalDebt.toFixed(2)),
								currentBalance: Number(currentData.currentBalance.toFixed(2))
							},
							{ merge: true }
						);
					});
				});
				this.borrowerService.getUser(suggestion.$investorId).subscribe((data) => {
					let currentData;
					data.forEach((docs) => {
						currentData = docs.data();
						currentData.totalInvestment += suggestion.amount;
						currentData.currentBalance -= suggestion.amount;
						this.borrowerService.getUserDocData(docs.id).set(
							{
								totalInvestment: Number(currentData.totalInvestment.toFixed(2)),
								currentBalance: Number(currentData.currentBalance.toFixed(2))
							},
							{ merge: true }
						);
					});
				});
				this.borrowerService.findLoanSuggestion(suggestion.$suggestionId);
				this.borrowerService.rejectLoanSuggestions(suggestion.$requestId);
				this.borrowerService.rejectLoanRequests(suggestion.$requestId);
			});
	}
}
