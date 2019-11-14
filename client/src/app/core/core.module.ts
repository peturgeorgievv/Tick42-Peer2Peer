import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NotificatorService } from './services/notificator.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	providers: [ NotificatorService ],
	declarations: [],
	imports: [
		CommonModule,
		HttpClientModule,
		ToastrModule.forRoot({
			timeOut: 3000,
			positionClass: 'toast-bottom-right',
			preventDuplicates: true,
			countDuplicates: true
		})
	]
})
export class CoreModule {}
