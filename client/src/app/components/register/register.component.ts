import { AuthenticationService } from './../../core/services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {
	public email: string;
	public password: string;

	constructor(public authenticationService: AuthenticationService) {}

	signUp() {
		this.authenticationService.SignUp(this.email, this.password);
		this.email = '';
		this.password = '';
	}

	ngOnInit() {}
}
