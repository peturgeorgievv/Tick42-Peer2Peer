import { SharedModule } from './../../shared/shared.module';
import { UsersComponent } from './users.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRouterModule } from './users-routing.module';
import { ShowDetailsModalComponent } from './show-details-modal/show-details-modal.component';

@NgModule({
	declarations: [ UsersComponent, ShowDetailsModalComponent ],
	imports: [ CommonModule, SharedModule, UsersRouterModule ],
	exports: [ UsersComponent ]
})
export class UsersModule {}
