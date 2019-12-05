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
  public allUsersSub: Subscription;
  public allLoans: number;
  public allLoansSub: Subscription;
  public allRequests: number;
  public allRequestsSub: Subscription;


  constructor(private readonly homepageService: HomepageService) { }

  ngOnInit() {
    this.allUsersSub = this.homepageService
      .getAllUsers()
      .subscribe(data => this.allUsers = data.docs.length);

    this.allLoansSub = this.homepageService
      .getAllLoans()
      .subscribe(data => this.allLoans = data.docs.length);

    this.allRequestsSub = this.homepageService
      .getAllRequests()
      .subscribe(data => this.allRequests = data.docs.length);
  }

  ngOnDestroy() {
    this.allUsersSub.unsubscribe();
    this.allLoansSub.unsubscribe();
    this.allRequestsSub.unsubscribe();
  }

}
