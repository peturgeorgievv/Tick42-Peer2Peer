import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestorComponent } from './investor.component';
import { InvestorRouterModule } from './investor-routing.module';
import { ProposeModalComponent } from './propose-modal/propose-modal.component';

@NgModule({
	declarations: [ InvestorComponent, ProposeModalComponent ],
	imports: [ CommonModule, SharedModule, InvestorRouterModule ],
	exports: [ InvestorComponent ]
})
export class InvestorModule {}
