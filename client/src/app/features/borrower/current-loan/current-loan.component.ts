import { AuthenticationService } from './../../../core/services/authentication.service';
import { UserDTO } from './../../../common/models/users/user-data.dto';
import { User } from 'firebase';
import { NotificatorService } from './../../../core/services/notificator.service';
import { Subscription } from 'rxjs';
import { AllPaymentsDTO } from './../../../common/models/all-payments.dto';
import { BorrowerService } from './../../../core/services/borrower.service';
import { CurrentLoanDTO } from './../../../common/models/current-loan.dto';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
	calculateNextDueDate,
	calculateOverdueDays,
	calculatePenaltyAmount,
	calculateEndOfContractDate,
	overallAmount
} from '../../../common/calculate-functions/calculate-func';

@Component({
	selector: 'app-current-loan',
	templateUrl: './current-loan.component.html',
	styleUrls: [ './current-loan.component.css' ]
})
export class CurrentLoanComponent implements OnInit, OnDestroy {
	@Input() loanData: CurrentLoanDTO;
	@Input() user: User;
	public userBalanceData: UserDTO;

	private paymentsSubscription: Subscription;
	private getOneLoanSubscription: Subscription;

	public allPayments: AllPaymentsDTO[] = [];
	public loanHistory: AllPaymentsDTO[];
	public amount: number;
	public date: string;
	public installment: number;
	public interestRate: number;
	public penalty: number;
	public period: number;
	public amountLeft: number;

	public dateEndOfContract: string;
	public totalAmount: number;

	constructor(
		private readonly borrowerService: BorrowerService,
		private readonly notificatorService: NotificatorService,
		private readonly authService: AuthenticationService
	) {}

	public ngOnInit(): void {
		this.getPayments(this.loanData.$suggestionId, this.loanData.$userId);
		this.amount = this.loanData.amount;
		this.date = this.loanData.date;
		this.installment = this.loanData.installment;
		this.interestRate = this.loanData.interestRate;
		this.penalty = this.loanData.penalty + this.loanData.interestRate;
		this.period = this.loanData.period;

		this.dateEndOfContract = calculateEndOfContractDate(this.date, this.period);
		this.totalAmount = overallAmount(this.amount, this.interestRate, this.period);
		this.authService.userBalanceDataSubject$.subscribe((res) => {
			this.userBalanceData = res;
		});
	}

	public ngOnDestroy(): void {
		this.paymentsSubscription.unsubscribe();
	}

	public getPayments(suggestionId: string, userId: string): void {
		this.paymentsSubscription = this.borrowerService
			.getPayments(suggestionId, userId)
			.subscribe((querySnapshot: AllPaymentsDTO[]) => {
				this.allPayments = querySnapshot;
				this.amountLeft = this.amount;
				this.allPayments.forEach((data) => (this.amountLeft -= data.amount));
				return this.amountLeft;
			});
	}

	public overdueDays(): number {
		return calculateOverdueDays(this.calcNextDueDate(), new Date().toString());
	}

	public overdueAmount(): number {
		const overdueDays = this.overdueDays();
		if (overdueDays > 0) {
			return calculatePenaltyAmount(overdueDays, this.amount, this.penalty);
		}
		return 0;
	}

	public calcNextDueDate(): string {
		return calculateNextDueDate(this.date, this.historyAmountsLength(this.allPayments));
	}

	public createPayment(data: AllPaymentsDTO): void {
		this.getOneLoanSubscription = this.borrowerService
			.getOneLoan(this.user.uid, this.loanData.$requestId)
			.subscribe((loanData) => {
				if (loanData[0]) {
					const loanId = loanData[0].payload.doc.id;

					if (this.amountLeft <= data.amount) {
						this.borrowerService.payFullyLoan(loanId);
					}
				} else {
					this.getOneLoanSubscription.unsubscribe();
				}
			});

		this.borrowerService
			.createPayment({
				...data
			})
			.then(() => {
				const balance = (this.userBalanceData.currentBalance -= data.amount);
				this.borrowerService.getUserDocData(this.userBalanceData.$userDocId).set(
					{
						currentBalance: Number(balance.toFixed(2))
					},
					{ merge: true }
				);
				let currentData;
				this.borrowerService.getUser(data.$investorId).subscribe((е) => {
					е.forEach((docs) => {
						currentData = docs.data();
						currentData.currentBalance += data.amount;
						this.borrowerService.getUserDocData(docs.id).set(
							{
								currentBalance: Number(currentData.currentBalance.toFixed(2))
							},
							{ merge: true }
						);
					});
					this.notificatorService.success('You have paid successefully!');
				});
			})
			.catch(() => this.notificatorService.error('Oops, something went wrong!'));
	}

	public currentLoanPayments(): AllPaymentsDTO[] {
		return (this.loanHistory = this.allPayments);
	}

	private historyAmountsLength(payments: AllPaymentsDTO[]): number {
		const history = [ ...payments ];
		return history.reduce((acc, data) => {
			if (data.$requestId === this.loanData.$requestId) {
				return (acc += 1);
			}
			return acc;
		}, 0);
	}
}
