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
	@Input() user: User;
	private userBalanceDataSubscription: Subscription;
	private subscriptions: Subscription[] = [];
	public nextDueDate: string[];

	public userBalanceData: UserDTO;

	constructor(public authService: AuthenticationService) {}

	ngOnInit() {
		this.userBalanceDataSubscription = this.authService.userBalanceDataSubject$.subscribe(
			(userBalanceData) => (this.userBalanceData = userBalanceData)
		);
		if (this.user) {
			this.subscriptions.push(
				this.authService
					.getNextDueDate(this.user.uid)
					.subscribe((nextDueDates) => (this.nextDueDate = nextDueDates[0]))
			);
		}
	}

	ngOnDestroy() {
		this.userBalanceDataSubscription.unsubscribe();
		this.subscriptions.forEach((subscription) => subscription.unsubscribe());
	}

	public signOut(): void {
		this.authService.signOut();
		this.subscriptions.forEach((subscription) => subscription.unsubscribe());
	}
}
