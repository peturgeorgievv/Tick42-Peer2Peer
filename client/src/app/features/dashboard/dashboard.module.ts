import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard.component';
import { DashboardRouterModule } from './dashboard-routing.module';
import { CreateDepositComponent } from './create-deposit/create-deposit.component';
import { CreateWithdrawComponent } from './create-withdraw/create-withdraw.component';

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
