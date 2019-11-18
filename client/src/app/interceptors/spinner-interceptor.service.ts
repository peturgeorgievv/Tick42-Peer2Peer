import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { delay, finalize } from 'rxjs/operators';

@Injectable()
export class SpinnerIntercerptorService implements HttpInterceptor {
	constructor(private readonly spinner: NgxSpinnerService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.spinner.show();

		return next.handle(req).pipe(delay(1), finalize(() => this.spinner.hide()));
	}
}
