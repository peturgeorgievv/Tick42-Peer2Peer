import { DashboardComponent } from './dashboard.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRouterModule } from './dashboard-routing.module';
import { RouterModule } from '@angular/router';
import { CreateDepositComponent } from './create-deposit/create-deposit.component';
import { CreateWithdrawComponent } from './create-withdraw/create-withdraw.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateDepositComponent,
    CreateWithdrawComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRouterModule,
    NgbModalModule
  ],
  exports: [
    DashboardComponent,
    RouterModule,
  ],
  entryComponents: [
    CreateDepositComponent,
    CreateWithdrawComponent,
  ],

})
export class DashboardModule { }
