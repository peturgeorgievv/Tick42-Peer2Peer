import { LoanSuggestionDTO } from './../../../common/models/loan-suggestion.dto';
import { User } from 'firebase';
import { BorrowerService } from './../../../core/services/borrower.service';
import { LoanRequestDTO } from './../../../common/models/loan-request.dto';
import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { calculateInstallment } from '../../../common/calculate-functions/calculate-func';

@Component({
	selector: 'app-loan-requests',
	templateUrl: './loan-requests.component.html',
	styleUrls: [ './loan-requests.component.css' ]
})
export class LoanRequestsComponent implements OnInit {
	@Input() loanRequestData: LoanRequestDTO;
	@Input() loanSuggestions: LoanRequestDTO;
	@Input() user: User;

	public amount: number;
	public period: number;
	public $requestId: string;

	constructor(private readonly borrowerService: BorrowerService) {}

	ngOnInit() {
		this.amount = this.loanRequestData.amount;
		this.period = this.loanRequestData.period;
		this.$requestId = this.loanRequestData.$requestId;
	}

	public deleteRequest(): void {
		this.borrowerService.deleteLoanSuggestion(this.$requestId);
		this.borrowerService.deleteLoanRequest(this.$requestId);
	}

	public rejectSuggestion(suggestionId: string): void {
		this.borrowerService.deleteLoanSuggestion(suggestionId);
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
				status: 'current'
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
				this.borrowerService.deleteLoanSuggestion(suggestion.$requestId);
				this.borrowerService.deleteLoanRequest(suggestion.$requestId);
			});
	}
}
