import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { InvestorService } from './../../core/services/investor.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'firebase';

@Component({
	selector: 'app-investor',
	templateUrl: './investor.component.html',
	styleUrls: [ './investor.component.css' ]
})
export class InvestorComponent implements OnInit {
	public currentInvestments = [];
	public loanRequests = [];
	public user: User;
	private userSubscription: Subscription;

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
				console.log(docs.data());
				console.log(docs.id);
				this.loanRequests.push({
					$requestId: docs.id,
					...docs.data()
				});
				console.log(this.loanRequests);
			});
		});
	}

	public createSuggestion(suggsetion, userId, reqId) {
		// this.loanRequests.find((data) => data.$requestId ===)
		this.investorService
			.createLoanSuggestion({
				$requestId: reqId,
				$investorId: this.user.uid,
				$userId: userId,
				status: 'suggestion',
				...suggsetion
			})
			.then(() => console.log('added suggestion'))
			.catch(() => {
				this.notificatorService.error('Oops, something went wrong!');
			});
		console.log(suggsetion, userId, reqId);
	}
}
