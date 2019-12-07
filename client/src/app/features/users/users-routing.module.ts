import { UsersComponent } from './users.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth-guard';

const userRoutes: Routes = [
	{
		path: '',
		component: UsersComponent,
		canActivate: [ AuthGuard ],
		pathMatch: 'full'
	}
];

@NgModule({
	declarations: [],
	imports: [ CommonModule, RouterModule.forChild(userRoutes) ],
	exports: [ RouterModule ]
})
export class UsersRouterModule {}
