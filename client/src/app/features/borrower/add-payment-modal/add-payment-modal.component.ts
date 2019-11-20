// tslint:disable: max-line-length
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
	calculateInstallment,
	calculateNextDueDate,
	calculateOverdue
} from '../../../common/calculate-functions/calculate-func';
import * as moment from 'moment';

@Component({
	selector: 'app-add-payment-modal',
	templateUrl: './add-payment-modal.component.html',
	styleUrls: [ './add-payment-modal.component.css' ]
})
export class AddPaymentModalComponent implements OnInit {
	// public addPayment: FormGroup;

	@Output() public readonly createPayment: EventEmitter<any> = new EventEmitter();
	@Input() loanFullData;

	constructor() {}

	ngOnInit() {}

	public calcInstallment(amount, interestRate, period) {
		return calculateInstallment(amount, interestRate, period);
	}

	public calcOverdue(dueDate, amount, penalty, interestRate, period, payments) {
		return calculateOverdue(dueDate, amount, penalty, interestRate, period, payments);
	}

	public emitLoanData() {
		const loanToAdd = {
			$requestId: this.loanFullData.$requestId,
			$userId: this.loanFullData.$userId,
			$investorId: this.loanFullData.$investorId,
			amount: this.calcInstallment(
				this.loanFullData.amount,
				this.loanFullData.interestRate,
				this.loanFullData.period
			),
			date: moment().format('YYYY-MM-DD'),
			overdue: this.calcOverdue(
				this.loanFullData.date,
				this.loanFullData.amount,
				this.loanFullData.penalty,
				this.loanFullData.interestRate,
				this.loanFullData.period,
				0
			)
		};

		this.createPayment.emit(loanToAdd);
		// this.addPayment.reset();
	}
}
