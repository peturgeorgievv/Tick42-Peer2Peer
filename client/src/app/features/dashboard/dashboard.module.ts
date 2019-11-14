import { DashboardComponent } from './dashboard.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRouterModule } from './dashboard-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, SharedModule, DashboardRouterModule],
  exports: [DashboardComponent, RouterModule]
})
export class DashboardModule {
  public mockUser = {

    username: 'Bai Ivan',
    firstName: 'Ivan',
    secondName: 'Ivanov',

    investments: 5000,
    currBalance: 1000,
    debt: 200

  };

}
