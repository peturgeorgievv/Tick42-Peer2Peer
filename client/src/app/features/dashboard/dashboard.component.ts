import { DashboardService } from './../../core/services/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../core/services/authentication.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public userData;
  public user: User;
  private userSubscription: Subscription;
  private currentData;

  constructor(
    private readonly dashboardService: DashboardService,
    public authService: AuthenticationService,
  ) {
    this.userSubscription = this.authService.loggedUser$.subscribe((res) => {
      return (this.user = res);
    });
  }

  ngOnInit() {
    this.dashboardService.getUser(this.user.uid).subscribe((
      e => {
        e.forEach((docs) => {
          this.userData = docs.data();
        }
        );
      }
    ));
  }

  createDeposit(data) {
    this.dashboardService.getUser(this.user.uid).subscribe((
      (е) => {
        е.forEach((docs) => {
          this.currentData = docs.data();
          this.currentData.currentBalance += data.amount;
          this.dashboardService
            .addOrRemoveMoney(docs.id)
            .set({ currentBalance: this.currentData.currentBalance }, { merge: true });
        });
      }
    ));
  }

  createWithdraw(data) {
    this.dashboardService.getUser(this.user.uid).subscribe((
      (e) => {
        e.forEach((docs) => {
          this.currentData = docs.data();
          this.currentData.currentBalance -= data.amount;
          this.dashboardService
            .addOrRemoveMoney(docs.id).
            set({ currentBalance: this.currentData.currentBalance }, { merge: true });
        });
      }
    ));
  }

}
