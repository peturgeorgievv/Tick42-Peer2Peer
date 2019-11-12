import { BorrowerComponent } from './borrower.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowerRouterModule } from './borrower-routing.module';

@NgModule({
	declarations: [ BorrowerComponent ],
	imports: [ CommonModule, SharedModule, BorrowerRouterModule ],
	exports: [ BorrowerComponent ]
})
export class BorrowerModule {}
