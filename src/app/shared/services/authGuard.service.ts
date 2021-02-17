import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { KeychainService } from './keychain.service';


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private keychainService: KeychainService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(!this.keychainService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      // this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
