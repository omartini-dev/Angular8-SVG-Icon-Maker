import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {
	public bgs=[];
  public bgpage = 1;
  public pageLabel = '0/0';
  public sub=null;
  public loading = false;
  constructor(private apiservice: ApiService,
							private sanitizer: DomSanitizer) { }

  ngOnInit() {

  	this.apiservice.getBackground();
  	this.sub = this.apiservice.bgChange.subscribe(res => {
			this.bgs = res;
      this.pageLabel = this.bgpage+ "/"+this.apiservice.totalbgpages;
      this.loading = false;
		});
    this.pageLabel = this.bgpage+ "/"+this.apiservice.totalbgpages;
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
  setBackground(id){
    this.apiservice.currentBg = this.apiservice.bgs[id][2];
    this.apiservice.currentBgId = this.apiservice.bgs[id][3];
		this.apiservice.setBackground();
	}
  pageNext() {
    if(this.apiservice.bgpage+1 >= this.apiservice.totalbgpages) return false;
    this.loading = true;
    this.apiservice.pageBgNext();
    this.bgpage = this.apiservice.bgpage + 1;
    this.pageLabel = this.bgpage+ "/"+this.apiservice.totalbgpages;
  }
  pagePrev() {
    if(this.apiservice.bgpage == 0) return false;
    this.loading = true;
    this.apiservice.pageBgPrev();
    this.bgpage = this.apiservice.bgpage + 1;
    this.pageLabel = this.bgpage+ "/"+this.apiservice.totalbgpages;
  }
  sortBgIcon(filter) {
    this.apiservice.bgfilter = filter;
    this.apiservice.bgpage = 0;
		this.apiservice.getBackground();
		this.bgpage = 1;
		this.pageLabel = "1/"+this.apiservice.totalbgpages;
  }
}
