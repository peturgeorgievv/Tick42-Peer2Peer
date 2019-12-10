import { NgModule } from '@angular/core';
import { AuthGuard } from './../../auth/auth-guard';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';

const dashboardRoutes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		pathMatch: 'full',
		canActivate: [ AuthGuard ]
	}
];

@NgModule({
	declarations: [],
	imports: [ CommonModule, RouterModule.forChild(dashboardRoutes) ],
	exports: [ RouterModule ]
})
export class DashboardRouterModule {}
