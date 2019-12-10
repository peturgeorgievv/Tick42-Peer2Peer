import { User } from 'firebase';
import { UserDTO } from './../../common/models/users/user-data.dto';
import { Subscription } from 'rxjs';
import { LoanRequestDTO } from '../../common/models/loan-request.dto';
import { InvestorService } from './../../core/services/investor.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { CurrentInvestmentsDTO } from './../../common/models/current-investments.dto';
import { Component, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-investor',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.css']
})
export class InvestorComponent implements OnInit, OnDestroy {
  public user: User;
  private subscriptions: Subscription[] = [];

  public userBalanceData: UserDTO;
  public loanRequests: LoanRequestDTO[] = [];
  public currentInvestments: CurrentInvestmentsDTO[] = [];

  constructor(
    private readonly investorService: InvestorService,
    public authService: AuthenticationService,
  ) {
    this.subscriptions.push(this.authService.loggedUser$.subscribe((res: User) => {
      return (this.user = res);
    }));
  }

  ngOnInit() {
    this.authService.userBalanceDataSubject$.subscribe((res: UserDTO) => {
      this.userBalanceData = res;
    });

    this.subscriptions.push(this.investorService
      .getAllLoanRequests()
      .subscribe((querySnapshot: LoanRequestDTO[]) => {
        this.loanRequests = [];
        this.loanRequests = querySnapshot;
        this.loanRequests = this.loanRequests.filter(loan => loan.$userId !== this.user.uid);
      }));

    this.subscriptions.push(this.investorService
      .getUserInvestments(this.user.uid)
      .subscribe((querySnapshot: CurrentInvestmentsDTO[]) => {
        this.currentInvestments = querySnapshot;
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
