import { AuthGuard } from './../../auth/auth-guard';
import { InvestorComponent } from './investor.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const investorRoutes: Routes = [
	{
		path: '',
		component: InvestorComponent,
		canActivate: [ AuthGuard ],
		pathMatch: 'full'
	}
];

@NgModule({
	declarations: [],
	imports: [ CommonModule, RouterModule.forChild(investorRoutes) ],
	exports: [ RouterModule ]
})
export class InvestorRouterModule {}
