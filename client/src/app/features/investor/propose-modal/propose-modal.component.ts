import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-propose-modal',
	templateUrl: './propose-modal.component.html',
	styleUrls: [ './propose-modal.component.css' ]
})
export class ProposeModalComponent implements OnInit {
	public addLoanSuggestion: FormGroup;

	@Output() public readonly createSuggestion: EventEmitter<any> = new EventEmitter();

	constructor(private readonly formBuilder: FormBuilder) {}

	ngOnInit() {
		this.addLoanSuggestion = this.formBuilder.group({
			interestRate: [ '', [ Validators.required ] ],
			penalty: [ '', [ Validators.required ] ],
			period: [ '', [ Validators.required ] ],
			amount: [ '', [ Validators.required ] ]
		});
	}

	public emitSuggsetion(suggestion) {
		const suggestionToAdd = {
			...suggestion
		};

		this.createSuggestion.emit(suggestionToAdd);
		this.addLoanSuggestion.reset();
	}
}
