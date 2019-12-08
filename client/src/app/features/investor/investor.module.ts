import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestorComponent } from './investor.component';
import { InvestorRouterModule } from './investor-routing.module';
import { ProposeModalComponent } from './propose-modal/propose-modal.component';
import { ShowInvestmentComponent } from './show-investment/show-investment.component';
import { ActiveLoanRequestsComponent } from './active-loan-requests/active-loan-requests.component';
import { PartialProposeModalComponent } from './partial-propose-modal/partial-propose-modal.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    InvestorComponent,
    ProposeModalComponent,
    ShowInvestmentComponent,
    ActiveLoanRequestsComponent,
    PartialProposeModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InvestorRouterModule,
    NgbModalModule,
  ],
  exports: [InvestorComponent],
  entryComponents: [ProposeModalComponent, PartialProposeModalComponent]
})
export class InvestorModule { }
