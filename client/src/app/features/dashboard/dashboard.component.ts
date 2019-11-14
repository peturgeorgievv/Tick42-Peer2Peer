import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public mockUser = {
    username: 'The Nigerian Prince',
    investments: 5000,
    currBalance: 1000,
    currDebt: 200
  };

  ngOnInit() {
  }

}
