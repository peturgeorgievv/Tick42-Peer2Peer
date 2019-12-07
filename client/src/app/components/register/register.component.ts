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
	public firstName: string;
	public lastName: string;
	public status = 'basic';

	constructor(public authenticationService: AuthenticationService) {}

	signUp() {
		this.authenticationService.signUp(this.email, this.password, this.firstName, this.lastName, this.status);
		this.email = '';
		this.password = '';
		this.firstName = '';
		this.lastName = '';
	}

	ngOnInit() {}
}
