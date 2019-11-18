import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-create-loan-modal',
	templateUrl: './create-loan-modal.component.html',
	styleUrls: [ './create-loan-modal.component.css' ]
})
export class CreateLoanModalComponent implements OnInit {
	public createLoan: FormGroup;

	@Output() public readonly createLoanRequest: EventEmitter<any> = new EventEmitter();

	constructor(private readonly formBuilder: FormBuilder) {}

	ngOnInit() {
		this.createLoan = this.formBuilder.group({
			period: [ '', [ Validators.required ] ],
			amount: [ '', [ Validators.required ] ]
		});
	}

	public emitLoanData(loanData) {
		const loanToAdd = {
			...loanData
		};

		this.createLoanRequest.emit(loanToAdd);
		this.createLoan.reset();
	}
}
