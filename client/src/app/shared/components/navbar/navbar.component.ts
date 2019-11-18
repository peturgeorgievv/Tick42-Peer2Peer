import { AuthenticationService } from './../../../core/services/authentication.service';
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { User } from 'firebase';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: [ './navbar.component.css' ]
})
export class NavbarComponent implements OnInit, OnChanges {
	@Input() loggedIn: boolean;
	@Input() user: User;

	constructor(public authService: AuthenticationService) {}

	ngOnInit() {}

	ngOnChanges() {}

	public signOut(): void {
		this.authService.signOut();
	}
}
