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

  public mockUser = {
    username: 'The Nigerian Prince',
    investments: 5000,
    currBalance: 1000,
    currDebt: 200
  };

  constructor(
    private readonly dashboardService: DashboardService,
    public authService: AuthenticationService,
  ) {
    this.userSubscription = this.authService.loggedUser$.subscribe((res) => {
      return (this.user = res);
    });
  }

  ngOnInit() { }

  createDeposit(data) {
    console.log(data.amount);
    // this.dashboardService.getUser(this.user.uid).subscribe();

    console.log(this.dashboardService.getUser(this.user.uid));
    // this.dashboardService.getUser(this.user.uid)
  }

  createWithdraw(data) {
    console.log(data.amount);
  }

}
