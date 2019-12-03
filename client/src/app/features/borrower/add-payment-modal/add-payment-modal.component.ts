import { CurrentLoanDTO } from './../../../common/models/current-loan.dto';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { calculateInstallment } from '../../../common/calculate-functions/calculate-func';
import * as moment from 'moment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-add-payment-modal',
	templateUrl: './add-payment-modal.component.html',
	styleUrls: [ './add-payment-modal.component.css' ]
})
export class AddPaymentModalComponent implements OnInit {
	@Output() public readonly createPayment: EventEmitter<any> = new EventEmitter();
	@Input() loanFullData: CurrentLoanDTO;
	@Input() overdueAmount: number;

	constructor(public activeModal: NgbActiveModal) {}

	ngOnInit() {}

	public calcInstallment(amount, interestRate, period) {
		return calculateInstallment(amount, interestRate, period);
	}

	public emitLoanData() {
		const loanToAdd = {
			$requestId: this.loanFullData.$requestId,
			$userId: this.loanFullData.$userId,
			$investorId: this.loanFullData.$investorId,
			$investorDocId: this.loanFullData.$investorDocId,
			$suggestionId: this.loanFullData.$suggestionId,
			amount: Number(this.loanFullData.installment),
			date: moment().format('YYYY-MM-DD'),
			overdue: this.overdueAmount
		};

		this.createPayment.emit(loanToAdd);
		this.activeModal.close();
	}

	public closeModal(): void {
		this.activeModal.dismiss();
	}
}
