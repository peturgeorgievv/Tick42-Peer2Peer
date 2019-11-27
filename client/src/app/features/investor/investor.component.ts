import { StatusENUM } from './../../common/enums/status.enum';
import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { InvestorService } from './../../core/services/investor.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'firebase';
import * as moment from 'moment';

@Component({
	selector: 'app-investor',
	templateUrl: './investor.component.html',
	styleUrls: [ './investor.component.css' ]
})
export class InvestorComponent implements OnInit, OnDestroy {
	public currentInvestments = [];
	public loanRequests = [];
	public user: User;
	private userSubscription: Subscription;
	public loanReqId;
	public loanUser;

	public userDocData;
	public getInvestmentsSubscription: Subscription;

	constructor(
		private readonly investorService: InvestorService,
		public authService: AuthenticationService,
		private readonly notificatorService: NotificatorService
	) {
		this.userSubscription = this.authService.loggedUser$.subscribe((res) => {
			return (this.user = res);
		});
	}

	ngOnInit() {
		this.investorService.getAllLoanRequests().subscribe((snaphost) => {
			snaphost.forEach((docs) => {
				this.loanRequests.push({
					...docs.payload.doc.data()
				});
			});
    });

		this.getInvestmentsSubscription = this.investorService
			.getUserInvestments(this.user.uid)
			.subscribe((querySnapshot) => {
				this.currentInvestments = [];
				querySnapshot.forEach((doc) => {
					const currentUser: any = doc;
					this.investorService.getUser(currentUser.$investorId).subscribe((е) => {
						е.forEach((docs) => {
							this.userDocData = docs.data();
							this.currentInvestments.push({
								email: this.userDocData.email,
								...doc
							});
						});
					});
				});
			});
	}

	ngOnDestroy() {
		this.userSubscription.unsubscribe();
		this.getInvestmentsSubscription.unsubscribe();
	}

}
