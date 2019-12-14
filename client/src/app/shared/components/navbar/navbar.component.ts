import { Subscription } from 'rxjs';
import { UserDTO } from './../../../common/models/users/user-data.dto';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { User } from 'firebase';
import * as moment from 'moment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() user: User;
  private subscriptions: Subscription[] = [];
  public nextDueDate: string;
  public overdueDebts = 0;

  public userBalanceData: UserDTO;

  constructor(public authService: AuthenticationService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.authService.userBalanceDataSubject$.subscribe(
        userBalanceData => (this.userBalanceData = userBalanceData)
      )
    );
    if (this.user) {
      this.subscriptions.push(
        this.authService
          .getNextDueDate(this.user.uid)
          .subscribe(nextDueDates => {
            this.nextDueDate = nextDueDates[0];
            nextDueDates.forEach(date => {
              if (moment(date).isBefore(new Date())) {
                this.overdueDebts += 1;
              }
            });
          })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public signOut(): void {
    this.authService.signOut();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
