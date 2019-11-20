import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'firebase';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit, OnDestroy {
	private loggedInSubscription: Subscription;
	private userSubscription: Subscription;
	private userBalanceDataSubscription: Subscription;

	public loggedIn: boolean;
	public user: User;
	public userBalanceData: User;
	constructor(private readonly authService: AuthenticationService) {}

	public ngOnInit() {
		this.loggedInSubscription = this.authService.isLoggedIn$.subscribe((loggedIn) => (this.loggedIn = loggedIn));
		this.userSubscription = this.authService.loggedUser$.subscribe((user) => (this.user = user));
		this.userBalanceDataSubscription = this.authService.loggedUserBalanceData$.subscribe(
			(userData) => (this.userBalanceData = userData)
		);
	}

	public ngOnDestroy() {
		this.loggedInSubscription.unsubscribe();
		this.userSubscription.unsubscribe();
		this.userBalanceDataSubscription.unsubscribe();
	}
}
