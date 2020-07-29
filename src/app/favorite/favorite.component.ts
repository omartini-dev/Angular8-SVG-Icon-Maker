import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { FileService } from '../service/file.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DialogComponent } from "../layout/dialog/dialog.component";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { SVG} from '@svgdotjs/svg.js';
import '@svgdotjs/svg.filter.js';
const MIME_TYPES = {
	pdf: 'application/pdf',
	jpg: 'application/octet-stream',
	ico: 'application/octet-stream',
	svg: 'application/octet-stream'
}
@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
	public favlist=[];
	public tmpdraw;
	public sub=null;
  constructor(private apiservice: ApiService,
							private sanitizer: DomSanitizer,
							private dialog:MatDialog,
							private fileService: FileService,
							private toastr: ToastrService,
							private _router: Router) { }

  ngOnInit() {
  	this.apiservice.getFav();
  	this.tmpdraw = SVG().addTo('#tmp');
  	this.sub = this.apiservice.favChange.subscribe(res => {
  		let icons=[];
  		this.favlist = [];
  		this.favlist = res;

			let svg:SafeHtml;
			let base64:any;
			for(var i=0; i<this.favlist.length;i++){
				for(var j=0; j<this.favlist[i].svg.length;j++){
					if(typeof(this.favlist[i].svg[j])!='string') return;
					svg = this.sanitizer.bypassSecurityTrustHtml(this.favlist[i].svg[j].replace(/\\\"/g,"\""));
					base64 = this.sanitizer.bypassSecurityTrustResourceUrl(this.favlist[i].base64[j]);
					this.favlist[i].svg[j] = svg;
					this.favlist[i].base64[j] = base64;
				}
			}
			
		});
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
  updateIconSet(id) {
  	for(var i=0; i<this.favlist.length;i++){
			if (this.favlist[i].id==id){
				this.apiservice.modifyIconSet(id, this.favlist[i].name).subscribe(
					(data : any) => {
						console.log(data);
					}
				);
				return;
			}
		}
  }
  editIconSet(id, index) {
  	this.apiservice.iconsetNo = id;
  	this.apiservice.iconset = this.favlist[index].svg;
  	this.apiservice.currentBg = this.favlist[index].bgsvg;
  	this.apiservice.iconsetName = this.favlist[index].name;
  	this._router.navigate(['editor']);
  }
  downsvg(target, id) {
		let filename = "iconTool."+target;
		if(target!='pdf') filename = 'iconPro.zip';
		
		for(let j=0; j<this.favlist.length;j++){
			if(this.favlist[j].id!=id) continue;
			
			let downloadSVG='';
			for(let i=0;i<this.favlist[j].svg.length;i++){
				this.tmpdraw.clear();
				if(i!=0)
					downloadSVG += "||";
				downloadSVG += this.tmpdraw.svg(this.favlist[j].svg[i]).last().svg();
			}

			this.fileService.download(downloadSVG, target,[], null)
			.subscribe(
				data => {
					const blob = new Blob([data], { type : MIME_TYPES[target]});
					saveAs(blob, filename);
				}
			);
			return;
		}
	}
	openDialog(id) {
		let downloadSVG='';
		for(let j=0; j<this.favlist.length;j++){
			if(this.favlist[j].id!=id) continue;
			for(let i=0;i<this.favlist[j].svg.length;i++){
				this.tmpdraw.clear();
				if(i!=0)
					downloadSVG += "||";
				downloadSVG += this.tmpdraw.svg(this.favlist[j].svg[i]).last().svg();
			}
		}
		this.apiservice.getlink(downloadSVG);
		this.apiservice.dlgTarget = 'share';
		const dialogConfig = new MatDialogConfig();
		dialogConfig.autoFocus = true;
		this.dialog.open(DialogComponent, dialogConfig);
	}
	trashSet(id){
		this.apiservice.trashSet(id).subscribe(
			(data : any) => {
				if(data=='success'){
					for(let j=0; j<this.favlist.length;j++){
						if(this.favlist[j].id==id){
							this.favlist.splice(j,1);
							break;
						}
					}
					this.toastr.success('Deleted successfully!');
				}
			}
		);
	}
	duplicate(id){
		this.apiservice.duplicateFav(id);
		this.toastr.success('Duplicated successfully!');
	}
}
