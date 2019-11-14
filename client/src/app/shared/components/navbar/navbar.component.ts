import { Observable } from 'rxjs';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { User } from 'firebase';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: [ './navbar.component.css' ]
})
export class NavbarComponent implements OnInit, OnChanges {
	public user;

	constructor(public authService: AuthenticationService) {}

	ngOnInit() {
		this.authService.loggedUser$.subscribe((res) => {
			this.user = res;
		});
	}

	ngOnChanges() {
		this.authService.loggedUser$.subscribe((res) => {
			this.user = res;
		});
	}

	public signOut(): void {
		this.authService.signOut();
	}
}
