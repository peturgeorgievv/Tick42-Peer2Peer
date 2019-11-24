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
	private userBalanceDataSubscription: Subscription;

	@Input() loggedIn: boolean;
	@Input() user: User;
	public userBalanceData: UserDTO;

	constructor(public authService: AuthenticationService, private readonly angularFireStore: AngularFirestore) {}

	ngOnInit() {}

	ngOnChanges() {
		if (this.user) {
			this.userData();
		}
	}

	public userData() {
		return (this.userBalanceDataSubscription = this.angularFireStore
			.collection('users', (ref) => ref.where('$userId', '==', this.user.uid))
			.valueChanges()
			.subscribe((querySnapshot) => {
				querySnapshot.forEach((doc: UserDTO) => {
					this.userBalanceData = doc;
				});
			}));
	}

	ngOnDestroy() {
		this.userBalanceDataSubscription.unsubscribe();
	}

	public signOut(): void {
		this.authService.signOut();
		this.userData();
	}
}
