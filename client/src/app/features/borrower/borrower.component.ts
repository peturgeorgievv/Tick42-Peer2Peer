import { AuthenticationService } from './../../core/services/authentication.service';
import { BorrowerService } from './../../core/services/borrower.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'firebase';

@Component({
	selector: 'app-borrower',
	templateUrl: './borrower.component.html',
	styleUrls: [ './borrower.component.css' ]
})
export class BorrowerComponent implements OnInit {
	public addLoanForm: FormGroup;
	public currentLoans: Array<any>;
	public toggleAddLoan = false;
	public user: User;

	constructor(
		private readonly borrowerService: BorrowerService,
		public authService: AuthenticationService,
		private readonly formBuilder: FormBuilder
	) {}

	public ngOnInit() {
		this.borrowerService.getAllLoans().subscribe(
			(data) =>
				(this.currentLoans = data.map((e) => {
					console.log(e.payload.doc.id);
					console.log(e.payload.doc.data());
					return {
						id: e.payload.doc.id,
						...e.payload.doc.data()
					} as any;
				}))
		);

		this.authService.loggedUser$.subscribe((res) => {
			this.user = res;
		});

		this.addLoanForm = this.formBuilder.group({
			amount: [ '', [ Validators.required ] ],
			date: [ '', [ Validators.required ] ],
			period: [ '', [ Validators.required ] ]
		});
	}

	public createLoan(loanData): void {
		console.log(loanData);
		console.log(this.user.uid);
		this.borrowerService.createLoanRequest({
			$userId: this.user.uid,
			...loanData
		});
	}

	public deleteLoan(id: string): void {
		this.borrowerService.deleteLoan(id);
	}
}
