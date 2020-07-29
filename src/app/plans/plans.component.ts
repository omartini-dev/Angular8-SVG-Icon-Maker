import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  public plans=[{subscribed:false},{subscribed:false}];
  constructor(private apiservice: ApiService,
  						private router: Router,) { }

  ngOnInit() {
    this.apiservice.getPlan().subscribe((res : any)=>{
      this.plans = res;
    });
  }
  subscription(plan){
  	this.apiservice.plan = plan;
    if(this.plans[0].subscribed || this.plans[1].subscribed){
      this.apiservice.changePlan(plan).subscribe((res : any)=>{
        if(res[0]=='success'){
          this.router.navigate(['success']);
        }
      });
    } else {
      this.router.navigate(['upgrade']);
    }
  }
}
