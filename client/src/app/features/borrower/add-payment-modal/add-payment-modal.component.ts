import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-add-payment-modal',
	templateUrl: './add-payment-modal.component.html',
	styleUrls: [ './add-payment-modal.component.css' ]
})
export class AddPaymentModalComponent implements OnInit {
	public addPayment: FormGroup;

	@Output() public readonly createPayment: EventEmitter<any> = new EventEmitter();

	constructor(private readonly formBuilder: FormBuilder) {}

	ngOnInit() {
		this.addPayment = this.formBuilder.group({
			amount: [ '', [ Validators.required ] ],
			nextDueDate: [ '', [ Validators.required ] ]
		});
	}

	public emitLoanData(loanData) {
		const loanToAdd = {
			...loanData
		};

		this.createPayment.emit(loanToAdd);
		this.addPayment.reset();
	}
}
