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
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import * as moment from 'moment';

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
  public isGraphShowed = false;
  public nextDueDate: string;
  public overdueDebts = 0;

  public dataSource;
  public innerWidth: number;
  public size = 'third';
  public allSizes = {
    firstSize: { width: '340px', height: '220px' },
    secondSize: { width: '400px', height: '280px' },
    thirdSize: { width: '480px', height: '360px' }
  };
  public styleObj: object;
  public chartObj: object;

  private subscriptions: Subscription[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1100) {
      this.onSelectionChange('firstSize');
    } else if (this.innerWidth > 1100 && this.innerWidth < 1450) {
      this.onSelectionChange('secondSize');
    } else if (this.innerWidth > 1450) {
      this.onSelectionChange('thirdSize');
    }
  }

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthenticationService,
    private readonly modalService: NgbModal
  ) {
    this.subscriptions.push(
      this.authService.loggedUser$.subscribe((res: User) => {
        return (this.user = res);
      })
    );
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1100) {
      this.size = 'firstSize';
    } else if (this.innerWidth > 1100 && this.innerWidth < 1450) {
      this.size = 'secondSize';
    } else if (this.innerWidth > 1450) {
      this.size = 'thirdSize';
    }
    this.subscriptions.push(
      this.authService.userBalanceDataSubject$.subscribe((res: UserDTO) => {
        this.userData = res;
      })
    );

    this.subscriptions.push(
      this.authService
        .getNextDueDate(this.user.uid)
        .subscribe((nextDate: string[]) => {
          this.nextDueDate = nextDate[0];
          nextDate.forEach(date => {
            if (moment(date).isBefore(new Date())) {
              this.overdueDebts += 1;
            }
          });
        })
    );

    this.subscriptions.push(
      this.dashboardService
        .getCurrentUserLoans(this.user.uid)
        .subscribe((querySnapshot: CurrentInvestmentsDTO[]) => {
          this.curLoans = querySnapshot;
          this.filteredForInvestors = [
            ...new Set(this.curLoans.map(loan => loan.$investorId))
          ];
        })
    );

    this.subscriptions.push(
      this.dashboardService
        .getCurrentUserInvestments(this.user.uid)
        .subscribe((querySnapshot: CurrentInvestmentsDTO[]) => {
          this.curInvestments = querySnapshot;
          this.filterForBorrowers = [
            ...new Set(this.curInvestments.map(loan => loan.$userId))
          ];
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }
  createGraph() {
    this.dataSource = {
      chart: {
        caption: 'User Balance with Debts',
        subCaption: 'Current Graph',
        showValues: '1',
        showPercentInTooltip: '0',
        numberPrefix: '$',
        enableMultiSlicing: '1',
        theme: 'gammel',
        baseFontSize: '11',
      },
      data: [
        {
          label: 'Balance',
          value: this.userData.currentBalance
        },
        {
          label: 'Debt',
          value: this.userData.totalDebt
        },
        {
          label: 'Investments',
          value: this.userData.totalInvestment
        }
      ]
    };
    this.styleObj = this.allSizes[this.size];
  }

  getStyle(): object {
    return this.styleObj;
  }

  initialized($event): void {
    this.chartObj = $event.chart;
  }
  onSelectionChange(size: string): void {
    this.size = size;
    this.styleObj = this.allSizes[this.size];
  }

  createDeposit(data: DepositWithdrawDTO) {
    this.dashboardService
      .getUserDocData(this.userData.$userDocId)
      .subscribe(userData => {
        const currUserData = userData.data();
        const balance: number = currUserData.currentBalance + data.amount;
        if (this.dataSource) {
          this.dataSource.data[0].value += data.amount;
        }

        this.dashboardService
          .addOrRemoveMoney(this.userData.$userDocId)
          .set({ currentBalance: balance }, { merge: true });
      });
  }

  createWithdraw(data: DepositWithdrawDTO) {
    this.dashboardService
      .getUserDocData(this.userData.$userDocId)
      .subscribe(userData => {
        const currUserData = userData.data();
        const balance = currUserData.currentBalance - data.amount;
        if (this.dataSource) {
          this.dataSource.data[0].value -= data.amount;
        }

        this.dashboardService
          .addOrRemoveMoney(this.userData.$userDocId)
          .set({ currentBalance: balance }, { merge: true });
      });
  }

  createDepositModal(): void {
    const createDepositModal = this.modalService.open(CreateDepositComponent);
    createDepositModal.componentInstance.createDepositRequest.subscribe(
      depositData => {
        this.createDeposit(depositData);
      }
    );
  }

  createWithdrawModal(): void {
    const createWithdrawModal = this.modalService.open(CreateWithdrawComponent);
    createWithdrawModal.componentInstance.userData = this.userData;
    createWithdrawModal.componentInstance.createWithdrawRequest.subscribe(
      withdrawData => {
        this.createWithdraw(withdrawData);
      }
    );
  }
}
