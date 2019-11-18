import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { InvestorService } from './../../core/services/investor.service';
import { Component, OnInit, Input } from '@angular/core';
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
	public loanReqId;
	public loanUser;

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
				console.log(this.loanRequests);
			});
		});
	}

	public loanRequestId(reqId: string) {
		return (this.loanReqId = reqId);
	}
	public loanUserId(userId: string) {
		return (this.loanUser = userId);
	}

	public createSuggestion(suggsetion): void {
		this.investorService
			.createLoanSuggestion({
				$requestId: this.loanReqId,
				$investorId: this.user.uid,
				$userId: this.loanUser,
				status: 'suggestion',
				...suggsetion
			})
			.then((ref) => this.investorService.addSuggestionId(ref.id))
			.catch(() => {
				this.notificatorService.error('Oops, something went wrong!');
			});
	}
}
