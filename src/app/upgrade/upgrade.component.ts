import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
declare var Stripe: any;
declare var elements: any;
declare var $: any;
@Component({
	selector: 'app-upgrade',
	templateUrl: './upgrade.component.html',
	styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {
	public form = {
		cardNumber:'',
		cardFname:'',
		cardLname:'',
		cardExpiry:'',
		cvc:''
	};
	public messages;
	public placeholders;
	public masks;
	public loading = false;
	public finalStep = false;
	public sub=null;
	public invalid = [0,0,0,0,0];
	public stripeVal;
	public element;
	public card;
	public scriptDom;
	public client_secret;
	constructor(private apiservice: ApiService,
							private router: Router,) { }
	loadStripe() {
		 
		if(!window.document.getElementById('stripe-custom-form-script')) {
			this.apiservice.getKey().subscribe((res : any)=>{
				this.client_secret = res.client;
				var s = window.document.createElement("script");
				s.id = "stripe-custom-form-script";
				s.type = "text/javascript";
				s.src = "https://js.stripe.com/v3/";
				s.onload = () => {
					this.stripeVal = Stripe(res['key']);
					this.element = this.stripeVal.elements();
					let config = {
						iconStyle: 'solid',
						style: {
							base: {
								lineHeight: '32px',
								fontWeight: 300,
								fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
								fontSize: '16px',

								'::placeholder': {
									color: '#8898AA',
								},
							},
							invalid: {
								iconColor: '#e85746',
								color: '#e85746',
							}
						},
						classes: {
							focus: 'is-focused',
							empty: 'is-empty',
						},
					}
					this.card = this.element.create('card',config);
					this.card.mount('#card-element');
					this.card.addEventListener('change', function(event) {
						var displayError = document.getElementById('card-errors');
						if (event.error) {
							displayError.textContent = event.error.message;
						} else {
							displayError.textContent = '';
						}
					});
					
				}
				this.scriptDom = s;
				window.document.body.appendChild(s);
			})
		}
	}
	ngOnInit() {
		this.loadStripe();
	}
	ngOnDestroy(){
		this.scriptDom.remove();
	}
	pay(event) {
		event.preventDefault();
	
		this.loading = true;

		this.stripeVal.confirmCardSetup(this.client_secret, {payment_method:{card:this.card}}).then(function(result) {
			if (result.error) {
				var errorElement = document.getElementById('card-errors');
				errorElement.textContent = result.error.message;
				$(".loader").css('display','none');
			} else {
				$("#tokenInput").val(result.setupIntent.payment_method);
				$("#subscribe").click();
			}
		});
		return true;
	}
	stripeTokenHandler() {
		let token = $("#tokenInput").val();
		this.apiservice.pay(this.apiservice.plan, token).subscribe(res => {
			if(res[0]=='success'){
				this.loading = false;
				this.router.navigate(['success']);
			}
		});
	}
}
