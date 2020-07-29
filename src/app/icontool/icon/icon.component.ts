import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent implements OnInit {
	public icons=[];
	public relatedicons=[];
	public page=1;
	public pageLabel = '0/0';
	public searchvalue='';
	public sub=null;
	public loading = true;
	constructor(private apiservice: ApiService,
							private sanitizer: DomSanitizer) { }

	ngOnInit() {

		this.apiservice.getIcons('');
		this.sub = this.apiservice.iconChange.subscribe(res => {
			this.icons=res;
			this.pageLabel = this.page + "/"+this.apiservice.totalpages;
			this.loading = false;
		});
		this.pageLabel = this.page + "/"+this.apiservice.totalpages;
	}
	ngOnDestroy(){
    this.sub.unsubscribe();
  }
	setIcon(event:any, id, terms){
		$(".icon-wrap").removeClass('active');
		$(event.currentTarget).addClass('active');
		if(terms!=null){
			this.apiservice.getRelatedIcons(terms).subscribe((res : any[])=>{
				this.apiservice.relatedicons=[];
				let svg:SafeHtml;
				for(var i=0; i<res.length;i++){
					svg = this.sanitizer.bypassSecurityTrustHtml(res[i].svg_reg.replace(/\\\"/g,"\""));
					this.apiservice.relatedicons.push([svg, res[i].id]);
				}
				this.relatedicons = this.apiservice.relatedicons;
			});
		}
		if(this.apiservice.iconCnt > 9) return false;
		this.apiservice.selectedIconIds.push(id);
		let rawsvgDom = event.currentTarget.children[0];
		this.apiservice.setIcon(rawsvgDom);
	}
	pageNext() {
		if(this.apiservice.page+1 >= this.apiservice.totalpages) return false;
		this.loading = true;
		this.apiservice.pageNext();
		this.page = this.apiservice.page + 1;
		this.pageLabel = this.page+ "/"+this.apiservice.totalpages;
	}
	pagePrev() {
		if(this.apiservice.page == 0) return false;
		this.loading = true;
		this.apiservice.pagePrev();
		this.page = this.apiservice.page + 1;
		this.pageLabel = this.page+ "/"+this.apiservice.totalpages;
	}
	searchIcon() {
		this.apiservice.page = 0;
		this.apiservice.getIcons(this.searchvalue);
		this.page = 1;
		this.pageLabel = "1/"+this.apiservice.totalpages;
	}
	sortIcon(filter) {
		this.apiservice.iconfilter = filter;
		this.searchIcon();
	}
}
