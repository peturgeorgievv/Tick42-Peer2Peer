import { Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { User } from 'firebase';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit, OnDestroy {
	private userSubscription: Subscription;

	public user: User;
	constructor(private readonly authService: AuthenticationService) {}

	public ngOnInit() {
		this.userSubscription = this.authService.loggedUser$.subscribe((user) => (this.user = user));
	}

	public ngOnDestroy() {
		this.userSubscription.unsubscribe();
	}
}
