import { RegisterComponent } from './components/register/register.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
	{ path: '', pathMatch: 'full', component: HomepageComponent },
	{
		path: 'borrower',
		loadChildren: () => import('./features/borrower/borrower.module').then((module) => module.BorrowerModule)
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./features/dashboard/dashboard.module').then((module) => module.DashboardModule)
	},
	{
		path: 'investor',
		loadChildren: () => import('./features/investor/investor.module').then((module) => module.InvestorModule)
	},
	{ path: 'sign-in', pathMatch: 'full', component: SignInComponent },
	{ path: 'register', pathMatch: 'full', component: RegisterComponent },
	{ path: 'not-found', component: NotFoundComponent },
	{ path: 'server-error', component: ServerErrorComponent },

	{ path: '**', redirectTo: '/not-found' }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
