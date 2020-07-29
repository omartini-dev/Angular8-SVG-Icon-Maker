import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from  '@angular/material';
import { ApiService } from '../../service/api.service';
import { FileService } from '../../service/file.service';
import { saveAs } from 'file-saver';
import { environment } from '../../../environments/environment';
import { UserService } from '../../service/user.service';
import { ToastrService } from 'ngx-toastr';
const MIME_TYPES = {
	pdf: 'application/pdf',
	jpg: 'application/octet-stream',
	ico: 'application/octet-stream',
	svg: 'application/octet-stream'
}
@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
	svg = '';
	target = '';
	link = '';
	favorite = '';
	iconset = '';
	sub = null;
	constructor(private dialogRef:MatDialogRef<DialogComponent>,
							private apiservice: ApiService,
							private user: UserService,
							private fileService: FileService,
							private toastr: ToastrService
							) { }

	ngOnInit() {
		this.target = this.apiservice.dlgTarget;
		this.sub = this.apiservice.linkChange.subscribe(res => {
			this.link = environment.baseUrl + res;
		});
		this.favorite = this.apiservice.iconsetName;
		this.iconset = this.apiservice.iconsetName;
	}
	ngOnDestroy(){
    this.sub.unsubscribe();
  }
	close(){
		this.dialogRef.close();
	}
	downsvg(target) {
		let filename = "iconPro."+target;
		if(target!='pdf') filename = 'iconPro.zip';

		let downloadSVG='';
		for(let i=0;i<this.apiservice.iconCnt;i++){
			if(i!=0)
				downloadSVG += "||";
			downloadSVG += this.apiservice.drawList[i].svg();
		}
		this.fileService.download(downloadSVG, target, this.apiservice.selectedIconIds, this.apiservice.currentBgId)
		.subscribe(
			data => {
				const blob = new Blob([data], { type : MIME_TYPES[target]});
				saveAs(blob, filename);
			}
		);
	}
	savesvg(){
		if(this.favorite!=''){
			this.apiservice.saveFavorite(this.favorite);
			this.dialogRef.close();
			this.toastr.success('Saved successfully!');
		}
	}
	updatesvg(){
		if(this.favorite!=''){
			this.apiservice.updateFavorite(this.favorite);
			this.dialogRef.close();
			this.toastr.success('Updated successfully!');
		}
	}
}
