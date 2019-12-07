import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './../../shared/shared.module';
import { UsersComponent } from './users.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRouterModule } from './users-routing.module';
import { ShowDetailsModalComponent } from './show-details-modal/show-details-modal.component';
import { CreateAdminModalComponent } from './create-admin-modal/create-admin-modal.component';

@NgModule({
	declarations: [ UsersComponent, ShowDetailsModalComponent, CreateAdminModalComponent ],
	imports: [ CommonModule, SharedModule, UsersRouterModule, NgbModalModule ],
	exports: [ UsersComponent ],
	providers: [ NgbActiveModal ],
	entryComponents: [ CreateAdminModalComponent, ShowDetailsModalComponent ]
})
export class UsersModule {}
