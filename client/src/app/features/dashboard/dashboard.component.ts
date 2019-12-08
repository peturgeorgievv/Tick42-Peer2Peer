import { CreateWithdrawComponent } from './create-withdraw/create-withdraw.component';
import { CreateDepositComponent } from './create-deposit/create-deposit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDTO } from './../../common/models/users/user-data.dto';
import { DashboardService } from './../../core/services/dashboard.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'firebase';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../core/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public userData: UserDTO;
  public user: User;
  private userSubscription: Subscription;
  private userLoansSubscription: Subscription;
  private userInvestmentSubscription: Subscription;

  public curLoans = [];
  public filteredForInvestors = [];

  public curInvestments = [];
  public filterForBorrowers = [];

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthenticationService,
    private readonly modalService: NgbModal,
  ) {
    this.userSubscription = this.authService.loggedUser$.subscribe((res) => {
      return (this.user = res);
    });
  }

  ngOnInit() {
    this.authService.userBalanceDataSubject$.subscribe((res) => {
      this.userData = res;
    });

    this.userLoansSubscription = this.dashboardService
      .getCurrentUserLoans(this.user.uid)
      .subscribe((querySnapshot) => {
        this.curLoans = querySnapshot;
        this.filteredForInvestors = [...new Set(this.curLoans.map((loan) => loan.$investorId))];
      });

    this.userInvestmentSubscription = this.dashboardService
      .getCurrentUserInvestments(this.user.uid)
      .subscribe((querySnapshot) => {
        this.curInvestments = querySnapshot;
        this.filterForBorrowers = [...new Set(this.curInvestments.map((loan) => loan.$userId))];
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.userLoansSubscription.unsubscribe();
    this.userInvestmentSubscription.unsubscribe();
  }

  createDeposit(data) {
    this.dashboardService.getUserDocData(this.userData.$userDocId).subscribe((userData) => {
      const currUserData = userData.data();
      const balance = currUserData.currentBalance + data.amount;

      this.dashboardService
        .addOrRemoveMoney(this.userData.$userDocId)
        .set({ currentBalance: balance }, { merge: true });
    });
  }

  createWithdraw(data) {
    this.dashboardService.getUserDocData(this.userData.$userDocId).subscribe((userData) => {
      const currUserData = userData.data();
      const balance = currUserData.currentBalance - data.amount;

      this.dashboardService
        .addOrRemoveMoney(this.userData.$userDocId)
        .set({ currentBalance: balance }, { merge: true });
    });
  }

  createDepositModal(): void {
    const createDepositModal = this.modalService.open(CreateDepositComponent);
    createDepositModal.componentInstance.createDepositRequest
      .subscribe((depositData) => {
        this.createDeposit(depositData);
      });
  }

  createWithdrawModal(): void {
    const createWithdrawModal = this.modalService.open(CreateWithdrawComponent);
    createWithdrawModal.componentInstance.userData = this.userData;

    createWithdrawModal.componentInstance.createWithdrawRequest
      .subscribe((withdrawData) => {
        this.createWithdraw(withdrawData);
      });
  }
}
