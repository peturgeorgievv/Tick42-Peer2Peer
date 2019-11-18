import { AuthenticationService } from '../core/services/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly authService: AuthenticationService) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.authService.isLoggedIn$.pipe(
			tap((loggedIn) => {
				if (!loggedIn) {
					// this.notificator.error(`You not authorized to access this page!`);
				}
			})
		);
	}
}
