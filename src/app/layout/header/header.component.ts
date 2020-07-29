import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	public currentUser: User;
	constructor(private router: Router,
							private authenticationService: AuthenticationService,
							private userService: UserService) {
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		this.currentUser = this.authenticationService.currentUserValue;
	}

	ngOnInit() {
	}
	logout() {
		this.authenticationService.logout();
		this.router.navigate(['/login']);
	}
}
