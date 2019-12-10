import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'firebase';

import { AuthenticationService } from './../../core/services/authentication.service';
import { InvestorService } from './../../core/services/investor.service';

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
  public loanReqId;
  public loanUser;
  public userBalanceData: UserDTO;

  private subscriptions: Subscription[] = [];


  constructor(
    private readonly investorService: InvestorService,
    public authService: AuthenticationService,
  ) {
    this.subscriptions.push(this.authService.loggedUser$.subscribe((res) => {
      return (this.user = res);
    }));

  }

  ngOnInit() {
    this.authService.userBalanceDataSubject$.subscribe((res) => {
      this.userBalanceData = res;
    });

    this.subscriptions.push(this.investorService
      .getAllLoanRequests()
      .subscribe((querySnaphost) => {
        this.loanRequests = [];
        this.loanRequests = querySnaphost;
        this.loanRequests = this.loanRequests.filter(loan => loan.$userId !== this.user.uid);
      }));

    this.subscriptions.push(this.investorService
      .getUserInvestments(this.user.uid)
      .subscribe((querySnapshot: CurrentLoanDTO[]) => {
        this.currentInvestments = querySnapshot;
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
