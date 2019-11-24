import { AllPaymentsDTO } from './../../../common/models/all-payments.dto';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-show-payments',
	templateUrl: './show-payments.component.html',
	styleUrls: [ './show-payments.component.css' ]
})
export class ShowPaymentsComponent implements OnInit {
	@Input() loanPayments;
	@Input() loanRequestId: string;

	constructor() {}

	ngOnInit() {}
}
