import { NotificatorService } from './../core/services/notificator.service';
import { AuthenticationService } from '../core/services/authentication.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly notificator: NotificatorService,
    private readonly router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    if (this.authService.isLoggedIn !== true) {
      this.notificator.error(`You are not authorized to access this page!`);
      this.router.navigate(['/not-found']);
    }
    return true;
  }
}
