import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'firebase';

import { AuthenticationService } from './../../core/services/authentication.service';
import { InvestorService } from './../../core/services/investor.service';
import { NotificatorService } from './../../core/services/notificator.service';

import { CurrentLoanDTO } from './../../common/models/current-loan.dto';
import { UserDTO } from './../../common/models/users/user-data.dto';

@Component({
  selector: 'app-investor',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.css']
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
  public getAllLoanRequests: Subscription;

  constructor(
    private readonly investorService: InvestorService,
    public authService: AuthenticationService,
    private readonly notificatorService: NotificatorService
  ) {
    this.userSubscription = this.authService.loggedUser$.subscribe((res) => {
      return (this.user = res);
    });
    this.authService.userBalanceDataSubject$.subscribe((res) => {
      this.userBalanceData = res;
    });
  }

  ngOnInit() {
    this.getAllLoanRequests = this.investorService
      .getAllLoanRequests()
      .subscribe((querySnaphost) => {
        this.loanRequests = [];
        this.loanRequests = querySnaphost;
        this.loanRequests = this.loanRequests.filter(loan => loan.$userId !== this.user.uid);
      });

    this.getInvestmentsSubscription = this.investorService
      .getUserInvestments(this.user.uid)
      .subscribe((querySnapshot: CurrentLoanDTO[]) => {
        this.currentInvestments = querySnapshot;
        // console.log(this.currentInvestments);
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.getInvestmentsSubscription.unsubscribe();
    this.getAllLoanRequests.unsubscribe();
  }
}
