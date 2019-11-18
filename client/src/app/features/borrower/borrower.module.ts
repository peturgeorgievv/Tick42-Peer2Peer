import { BorrowerComponent } from './borrower.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowerRouterModule } from './borrower-routing.module';
import { CreateLoanModalComponent } from './create-loan-modal/create-loan-modal.component';

@NgModule({
	declarations: [ BorrowerComponent, CreateLoanModalComponent ],
	imports: [ CommonModule, SharedModule, BorrowerRouterModule ],
	exports: [ BorrowerComponent ]
})
export class BorrowerModule {}
