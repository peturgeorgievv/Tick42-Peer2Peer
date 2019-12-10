import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: [ './sign-in.component.css' ]
})
export class SignInComponent implements OnInit {
	public signinForm: FormGroup;

	constructor(public authenticationService: AuthenticationService, public formBuilder: FormBuilder) {}

	ngOnInit() {
		this.signinForm = this.formBuilder.group({
			email: [ '' ],
			password: [ '' ]
		});
	}

	signIn() {
		const data = this.signinForm.value;
		this.authenticationService.signIn(data.email, data.password);
	}
}
