import { Subscription } from 'rxjs';
import { UserDTO } from './../../../common/models/users/user-data.dto';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { User } from 'firebase';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: [ './navbar.component.css' ]
})
export class NavbarComponent implements OnInit, OnDestroy {
	@Input() loggedIn: boolean;
	@Input() user: User;
	private userBalanceDataSubscription: Subscription;

	public userBalanceData: UserDTO;

	constructor(public authService: AuthenticationService) {}

	ngOnInit() {
		this.userBalanceDataSubscription = this.authService.userBalanceDataSubject$.subscribe(
			(userBalanceData) => (this.userBalanceData = userBalanceData)
		);
	}

	ngOnDestroy() {
		this.userBalanceDataSubscription.unsubscribe();
	}

	public signOut(): void {
		this.authService.signOut();
	}
}
