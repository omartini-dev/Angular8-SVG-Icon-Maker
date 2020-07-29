import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FileService } from '../../service/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { DialogComponent} from "../../layout/dialog/dialog.component";
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
@Component({
	selector: 'app-editlayout',
	templateUrl: './editlayout.component.html',
	styleUrls: ['./editlayout.component.css']
})
export class EditlayoutComponent implements OnInit {
	public active = 'icon';
	public currentUser: User;
	constructor(private apiservice: ApiService,
							private sanitizer: DomSanitizer,
							private router: Router,
							private authenticationService: AuthenticationService,
							private userService: UserService,
							private dialog:MatDialog,
							private fileService: FileService,) {
		this.currentUser = this.authenticationService.currentUserValue;
	}

	ngOnInit() {
		window.scroll(0, 0);
	}
	activeMenu(menu) {
		this.active = menu;
	}
	openDialog(target) {
		if(target=='share'){
			let downloadSVG='';
			for(let i=0;i<this.apiservice.iconCnt;i++){
				if(i!=0)
					downloadSVG += "||";
				downloadSVG += this.apiservice.drawList[i].svg();
			}
			this.apiservice.getlink(downloadSVG);
		}
		this.apiservice.dlgTarget = target;
		const dialogConfig = new MatDialogConfig();
		dialogConfig.autoFocus = true;
		this.dialog.open(DialogComponent, dialogConfig);
	}
}
