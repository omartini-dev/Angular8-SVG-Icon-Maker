import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../service/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            let expirationDate = localStorage.getItem('expirationDate');
            const currentDate = new Date().getTime();
            // authorised so return true
            if(currentDate < parseInt(expirationDate)){
                expirationDate = new Date(new Date().getTime() + 60*60*1000).getTime().toString();
                localStorage.setItem('expirationDate', expirationDate);
                return true;
            }

        }
        localStorage.removeItem('currentUser');
        localStorage.removeItem('expirationDate');
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/logout'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}