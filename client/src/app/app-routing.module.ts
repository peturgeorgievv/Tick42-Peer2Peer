import { RegisterComponent } from './components/register/register.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{ path: '', pathMatch: 'full', component: HomepageComponent },
	{
		path: 'borrower',
		loadChildren: () => import('./features/borrower/borrower.module').then((m) => m.BorrowerModule)
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule)
	},
	{
		path: 'investor',
		loadChildren: () => import('./features/investor/investor.module').then((m) => m.InvestorModule)
	},
	{ path: 'sign-in', pathMatch: 'full', component: SignInComponent },
	{ path: 'register', pathMatch: 'full', component: RegisterComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
