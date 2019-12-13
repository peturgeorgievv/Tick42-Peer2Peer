import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InvestorComponent } from './investor.component';
import { InvestorRouterModule } from './investor-routing.module';
import { ProposeModalComponent } from './propose-modal/propose-modal.component';
import { ShowInvestmentComponent } from './show-investment/show-investment.component';
import { ActiveLoanRequestsComponent } from './active-loan-requests/active-loan-requests.component';
import { PartialProposeModalComponent } from './partial-propose-modal/partial-propose-modal.component';
import { ShowProposalsModalComponent } from './show-proposals-modal/show-proposals-modal.component';

@NgModule({
  declarations: [
    InvestorComponent,
    ProposeModalComponent,
    ShowInvestmentComponent,
    ActiveLoanRequestsComponent,
    PartialProposeModalComponent,
    ShowProposalsModalComponent
  ],
  imports: [CommonModule, SharedModule, NgbModalModule, InvestorRouterModule],
  exports: [InvestorComponent],
  entryComponents: [
    ProposeModalComponent,
    PartialProposeModalComponent,
    ShowProposalsModalComponent
  ]
})
export class InvestorModule {}
