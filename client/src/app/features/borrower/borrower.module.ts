import { BorrowerComponent } from './borrower.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowerRouterModule } from './borrower-routing.module';
import { CreateLoanModalComponent } from './create-loan-modal/create-loan-modal.component';
import { AddPaymentModalComponent } from './add-payment-modal/add-payment-modal.component';
import { ShowPaymentsComponent } from './show-payments/show-payments.component';
import { CurrentLoanComponent } from './current-loan/current-loan.component';
import { LoanRequestsComponent } from './loan-requests/loan-requests.component';
import { NgbModalModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [
		BorrowerComponent,
		CreateLoanModalComponent,
		AddPaymentModalComponent,
		ShowPaymentsComponent,
		CurrentLoanComponent,
		LoanRequestsComponent
	],
	imports: [ CommonModule, SharedModule, BorrowerRouterModule, NgbModalModule ],
	exports: [ BorrowerComponent ],
	entryComponents: [ AddPaymentModalComponent, ShowPaymentsComponent, CreateLoanModalComponent ],
	providers: [ NgbActiveModal ]
})
export class BorrowerModule {}
