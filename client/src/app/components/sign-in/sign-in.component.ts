import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: [ './sign-in.component.css' ]
})
export class SignInComponent implements OnInit {
	public email: string;
	public password: string;

	constructor(public authenticationService: AuthenticationService) {}

	ngOnInit() {}

	signIn() {
		this.authenticationService.signIn(this.email, this.password);
		this.email = '';
		this.password = '';
	}
}
