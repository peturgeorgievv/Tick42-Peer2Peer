import { User } from 'firebase';
import { UserDTO } from './../../common/models/users/user-data.dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DashboardService } from './../../core/services/dashboard.service';
import { DepositWithdrawDTO } from './../../common/models/deposit-withdral.dto';
import { CurrentInvestmentsDTO } from './../../common/models/current-investments.dto';
import { AuthenticationService } from './../../core/services/authentication.service';
import { CreateDepositComponent } from './create-deposit/create-deposit.component';
import { CreateWithdrawComponent } from './create-withdraw/create-withdraw.component';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {
  public user: User;
  public userData: UserDTO;
  public curLoans: CurrentInvestmentsDTO[] = [];
  public curInvestments: CurrentInvestmentsDTO[] = [];
  public filterForBorrowers: string[] = [];
  public filteredForInvestors: string[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthenticationService,
    private readonly modalService: NgbModal,
  ) {
    this.subscriptions.push(this.authService.loggedUser$.subscribe((res) => {
      return (this.user = res);
    }));
  }

  ngOnInit() {
    this.subscriptions.push(this.authService.userBalanceDataSubject$.subscribe((res) => {
      this.userData = res;
    }));

    this.subscriptions.push(this.dashboardService
      .getCurrentUserLoans(this.user.uid)
      .subscribe((querySnapshot: CurrentInvestmentsDTO[]) => {
        this.curLoans = querySnapshot;
        this.filteredForInvestors = [...new Set(this.curLoans.map((loan) => loan.$investorId))];
      }));

    this.subscriptions.push(this.dashboardService
      .getCurrentUserInvestments(this.user.uid)
      .subscribe((querySnapshot: CurrentInvestmentsDTO[]) => {
        this.curInvestments = querySnapshot;
        this.filterForBorrowers = [...new Set(this.curInvestments.map((loan) => loan.$userId))];
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  createDeposit(data: DepositWithdrawDTO) {
    this.dashboardService.getUserDocData(this.userData.$userDocId).subscribe((userData) => {
      const currUserData = userData.data();
      const balance: number = currUserData.currentBalance + data.amount;

      this.dashboardService
        .addOrRemoveMoney(this.userData.$userDocId)
        .set({ currentBalance: balance }, { merge: true });
    });
  }

  createWithdraw(data: DepositWithdrawDTO) {
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
