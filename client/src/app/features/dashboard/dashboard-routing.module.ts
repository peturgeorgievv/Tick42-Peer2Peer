import { AuthGuard } from './../../auth/auth-guard';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
