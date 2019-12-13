import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard.component';
import { DashboardRouterModule } from './dashboard-routing.module';
import { CreateDepositComponent } from './create-deposit/create-deposit.component';
import { CreateWithdrawComponent } from './create-withdraw/create-withdraw.component';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import { FusionChartsModule } from 'angular-fusioncharts';

FusionChartsModule.fcRoot(FusionCharts, Charts);
@NgModule({
  declarations: [
    DashboardComponent,
    CreateDepositComponent,
    CreateWithdrawComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRouterModule,
    NgbModalModule,
    FusionChartsModule
  ],
  exports: [DashboardComponent, RouterModule],
  entryComponents: [CreateDepositComponent, CreateWithdrawComponent]
})
export class DashboardModule {}
