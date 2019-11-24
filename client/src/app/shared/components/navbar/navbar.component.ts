import { Subscription } from 'rxjs';
import { UserDTO } from './../../../common/models/users/user-data.dto';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { User } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: [ './navbar.component.css' ]
})
export class NavbarComponent implements OnInit, OnChanges, OnDestroy {
	@Input() loggedIn: boolean;
	@Input() user: User;

	public userBalanceDataSubscription: Subscription;
	public userBalanceData: UserDTO;

	constructor(public authService: AuthenticationService, private readonly angularFireStore: AngularFirestore) {}

	ngOnInit() {}

	ngOnChanges() {
		if (this.user) {
			this.userBalanceDataSubscription = this.authService
				.userBalanceData(this.user.uid)
				.subscribe((querySnapshot: UserDTO[]) => {
					return (this.userBalanceData = querySnapshot[0]);
				});
		}
	}

	ngOnDestroy() {
		this.userBalanceDataSubscription.unsubscribe();
	}

	public signOut(): void {
		this.authService.signOut();
	}
}
