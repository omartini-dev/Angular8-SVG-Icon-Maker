import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	loading = false;
	submitted = false;
	returnUrl: string;
	inputVal = {email:'', password:''};
	failed = false;
	invalid = [0,0];
	not_allowed = false;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private alertService: AlertService
	) {
		if (this.authenticationService.currentUserValue) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}
	onSubmit() {
		this.submitted = true;
		this.not_allowed = false;
		// reset alerts on submit
		this.alertService.clear();
		// stop here if form is invalid
		let pass = true;
		if (this.inputVal.email=='') {
			this.invalid[0] = 1;
			pass = false;
		}
		if (this.inputVal.password=='') {
			this.invalid[1] = 1;
			pass = false;
		}
		if(! pass) return;
		this.loading = true;
		this.authenticationService.login(this.inputVal.email, this.inputVal.password)
			.pipe(first())
			.subscribe(
				data => {
					this.router.navigate([this.returnUrl]);
				},
				error => {
					this.failed = true;
					if(error.error.text=='not_allowed'){
						this.not_allowed = true;
					}
					this.alertService.error(error);
					this.loading = false;
				});
	}
	closeAlert(){
		this.failed = false;
	}
}
