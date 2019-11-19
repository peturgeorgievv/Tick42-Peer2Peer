import { BorrowerComponent } from './borrower.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowerRouterModule } from './borrower-routing.module';
import { CreateLoanModalComponent } from './create-loan-modal/create-loan-modal.component';
import { AddPaymentModalComponent } from './add-payment-modal/add-payment-modal.component';
import { ShowPaymentsComponent } from './show-payments/show-payments.component';

@NgModule({
	declarations: [ BorrowerComponent, CreateLoanModalComponent, AddPaymentModalComponent, ShowPaymentsComponent ],
	imports: [ CommonModule, SharedModule, BorrowerRouterModule ],
	exports: [ BorrowerComponent ]
})
export class BorrowerModule {}
