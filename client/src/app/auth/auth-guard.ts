import { NotificatorService } from './../core/services/notificator.service';
import { AuthenticationService } from '../core/services/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly authService: AuthenticationService,
		private readonly notificator: NotificatorService,
		private readonly router: Router
	) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
		if (this.authService.isLoggedIn !== true) {
			this.notificator.error(`You not authorized to access this page!`);
			this.router.navigate([ '/' ]);
		}
		return true;
	}
}
