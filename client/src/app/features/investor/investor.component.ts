import { CurrentLoanDTO } from './../../common/models/current-loan.dto';
import { UserDTO } from './../../common/models/users/user-data.dto';
import { StatusENUM } from './../../common/enums/status.enum';
import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { InvestorService } from './../../core/services/investor.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'firebase';

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
	public userBalanceData: UserDTO;

	public getInvestmentsSubscription: Subscription;

	constructor(private readonly investorService: InvestorService, public authService: AuthenticationService) {
		this.userSubscription = this.authService.loggedUser$.subscribe((res) => {
			return (this.user = res);
		});
		this.authService.userBalanceDataSubject$.subscribe((res) => {
			this.userBalanceData = res;
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
			.subscribe((querySnapshot: CurrentLoanDTO[]) => {
				this.currentInvestments = querySnapshot;
			});
	}

	ngOnDestroy() {
		this.userSubscription.unsubscribe();
		this.getInvestmentsSubscription.unsubscribe();
	}
}
