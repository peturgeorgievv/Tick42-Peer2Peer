import { BorrowerComponent } from './borrower.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth-guard';

const borrowerRoutes: Routes = [
	{
		path: '',
		component: BorrowerComponent,
		canActivate: [ AuthGuard ],
		pathMatch: 'full'
	}
];

@NgModule({
	declarations: [],
	imports: [ CommonModule, RouterModule.forChild(borrowerRoutes) ],
	exports: [ RouterModule ]
})
export class BorrowerRouterModule {}
