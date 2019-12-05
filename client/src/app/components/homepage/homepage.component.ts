import { Subscription } from 'rxjs';
import { HomepageService } from './../../core/services/homepage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  public allUsers: any = [];
  public allUsersSub: Subscription;
  public allLoans = [];
  public allInvestments = [];
  public maxInterest: number;

  constructor(private readonly homepageService: HomepageService) { }

  ngOnInit() {
    this.allUsersSub = this.homepageService
      .getAllUsers()
      .subscribe(data => { console.log(data.docs.length);

        // this.allUsers = data;
      });

  }


}
