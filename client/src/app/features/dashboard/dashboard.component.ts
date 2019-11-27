import { DashboardService } from './../../core/services/dashboard.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../core/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public userData;
  public user: User;
  private userSubscription: Subscription;
  private currentData;
  private userLoansSubscription: Subscription;
  private userInvestmentSubscription: Subscription;

  public curLoans = [];
  public curInvestments = [];

  constructor(private readonly dashboardService: DashboardService, public authService: AuthenticationService) {
    this.userSubscription = this.authService.loggedUser$.subscribe((res) => {
      return (this.user = res);
    });
  }

  ngOnInit() {
    this.dashboardService.getUser(this.user.uid).subscribe((e) => {
      e.forEach((docs) => {
        this.userData = docs.data();
      });
    });

    this.userLoansSubscription = this.dashboardService
      .getCurrentUserLoans(this.user.uid)
      .subscribe((querySnapshot) => {

        this.curLoans = querySnapshot;

        // this.curLoans = [];
        // querySnapshot.forEach((doc) => {
        //   const curUser: any = doc;
        //   this.dashboardService.getUser(curUser.$requestId).subscribe((data) => {
        //     data.forEach((docs) => {
        //       this.userData = docs.data();
        //       this.curLoans.push({
        //         ...docs
        //       });
        //     });
        //   });

        // });
        console.log(this.curLoans);


      });

    this.userInvestmentSubscription = this.dashboardService
      .getCurrentUserInvestments(this.user.uid)
      .subscribe((querySnapshot) => {
        this.curInvestments = [];
        querySnapshot.forEach((doc) => {
          const curUser: any = doc.payload.doc.data();
          this.dashboardService.getUser(curUser.$investorId).subscribe((e) => {
            e.forEach((docs) => {
              this.userData = docs.data();
            });
            this.curInvestments.push({
              ...doc.payload.doc.data()
            });
          });
        });
        // console.log(this.curInvestments);
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.userLoansSubscription.unsubscribe();
    this.userInvestmentSubscription.unsubscribe();
  }

  createDeposit(data) {
    this.dashboardService.getUser(this.user.uid).subscribe((е) => {
      е.forEach((docs) => {
        this.currentData = docs.data();
        this.currentData.currentBalance += data.amount;
        this.dashboardService
          .addOrRemoveMoney(docs.id)
          .set({ currentBalance: this.currentData.currentBalance }, { merge: true });
      });
    });
  }

  createWithdraw(data) {
    this.dashboardService.getUser(this.user.uid).subscribe((e) => {
      e.forEach((docs) => {
        this.currentData = docs.data();
        this.currentData.currentBalance -= data.amount;
        this.dashboardService
          .addOrRemoveMoney(docs.id)
          .set({ currentBalance: this.currentData.currentBalance }, { merge: true });
      });
    });
  }
}
