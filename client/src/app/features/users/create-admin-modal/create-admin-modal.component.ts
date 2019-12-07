import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-create-admin-modal',
	templateUrl: './create-admin-modal.component.html',
	styleUrls: [ './create-admin-modal.component.css' ]
})
export class CreateAdminModalComponent implements OnInit {
	@Output() public readonly createAdmin: EventEmitter<any> = new EventEmitter();

	public createAdminDataForm: FormGroup;

	constructor(public activeModal: NgbActiveModal, private readonly formBuilder: FormBuilder) {}

	public ngOnInit(): void {
		this.createAdminDataForm = this.formBuilder.group({
			email: [ '', [ Validators.required, Validators.minLength(6) ] ],
			firstName: [ '', [ Validators.required, Validators.minLength(2) ] ],
			lastName: [ '', [ Validators.required, Validators.minLength(2) ] ],
			password: [ '', [ Validators.required, Validators.minLength(6) ] ]
		});
	}

	public emitUserData(): void {
		// const loanToAdd: AllPaymentsDTO = {
		// 	$requestId: this.loanFullData.$requestId,
		// 	$userId: this.loanFullData.$userId,
		// 	$investorId: this.loanFullData.$investorId,
		// 	$investorDocId: this.loanFullData.$investorDocId,
		// 	$suggestionId: this.loanFullData.$suggestionId,
		// 	amount: Number(this.loanFullData.installment),
		// 	date: moment().format('YYYY-MM-DD'),
		// 	overdue: this.overdueAmount
		// };

		this.createAdmin.emit();
		this.activeModal.close();
	}

	public closeModal(): void {
		this.activeModal.dismiss();
	}
}
