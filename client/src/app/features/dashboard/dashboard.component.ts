import { DashboardService } from './../../core/services/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
	userData;

	constructor(private readonly dashboardService: DashboardService) {}

	public mockUser = {
		username: 'The Nigerian Prince',
		investments: 5000,
		currBalance: 1000,
		currDebt: 200
	};

	ngOnInit() {}

	// createDeposit(data) {
	//   console.log(data.amount);

	//   this.dashboardService.getUser(userId).subscribe((querySnapshot) => {
	//     querySnapshot.forEach(doc => {
	//       this.userData = doc.payload.doc.data();
	//       console.log(this.userData);

	//     });

	//     // this.dashboardService
	//   });
	// }
}
