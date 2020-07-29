import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
	loading = false;
	submitted = false;
	inputVal = {email:'', password:'', name:'', terms:false};
	failed = false;
	invalid = [0,0,0,0];
	error_content = '';
  constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		private alertService: AlertService
	) {
  	if (this.authenticationService.currentUserValue) {
			this.router.navigate(['/']);
		}
  }

  ngOnInit() {
  }
	onSubmit() {
		this.submitted = true;

		// reset alerts on submit
		this.alertService.clear();

		// stop here if form is invalid
		let pass = true;
		if (this.inputVal.name=='') {
			this.invalid[0] = 1;
			pass = false;
		}
		if (this.inputVal.password=='') {
			this.invalid[2] = 1;
			pass = false;
		}
		if (this.inputVal.email=='') {
			this.invalid[1] = 1;
			pass = false;
		}
		if (! this.inputVal.terms) {
			this.invalid[3] = 1;
			pass = false;
		}
		if(! pass) return;
		this.loading = true;
		this.authenticationService.register(this.inputVal)
			.pipe(first())
			.subscribe(
				data => {
					this.loading = false;
					if(data!='success'){
						this.failed = true;
						if(typeof(data['email'])!='undefined'){
							this.error_content += data['email'] +'<br>';
						}
						if(typeof(data['name'])!='undefined'){
							this.error_content += data['name'] +'<br>';
						}
						if(typeof(data['password'])!='undefined'){
							this.error_content += data['password'] +'<br>';
						}
						return false;
					}
					this.alertService.success('Registration successful', true);
					this.router.navigate(['/editor']);
				},
				error => {
					this.alertService.error(error);
					this.loading = false;
				});
	}
	closeAlert(){
		this.failed = false;
		this.error_content = '';
	}
}
