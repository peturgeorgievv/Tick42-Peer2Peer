import { Subscription } from 'rxjs';
import { HomepageService } from './../../core/services/homepage.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  public allUsers: number;
  public allLoans: number;
  public allRequests: number;

  private subscriptions: Subscription[] = [];


  constructor(private readonly homepageService: HomepageService) { }

  ngOnInit() {
    this.subscriptions.push(this.homepageService
      .getAllUsers()
      .subscribe(data => this.allUsers = data.docs.length));

    this.subscriptions.push(this.homepageService
      .getAllLoans()
      .subscribe(data => this.allLoans = data.docs.length));

    this.subscriptions.push(this.homepageService
      .getAllRequests()
      .subscribe(data => this.allRequests = data.docs.length));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
