import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ApiService } from '../../service/api.service';
import { SVG} from '@svgdotjs/svg.js';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-transform',
  templateUrl: './transform.component.html',
  styleUrls: ['./transform.component.css']
})
export class TransformComponent implements OnInit {

  constructor(private transferRef: MatBottomSheetRef<TransformComponent>,
  						private apiservice: ApiService,
  						private sanitizer: DomSanitizer,) { }

	public rotation = 0;
	public shapesize = 100;
	public selectedIcon;
	public sub=null;
	public curImageSrc:SafeHtml;
  ngOnInit() {
  	this.selectedIcon = SVG().addTo('#selectedIcon').size(80,80);
  	this.sub = this.apiservice.selectedIconChange.subscribe(res => {
			this.selectedIcon.clear();
			if(this.apiservice.draw)
				this.selectedIcon.svg(this.apiservice.draw.svg()).last().size(80,80);
			this.rotation = this.apiservice.transInfo[this.apiservice.currentIcon].rot;
			this.shapesize = this.apiservice.transInfo[this.apiservice.currentIcon].zoom * 100;
			this.drawImage();
		});
  }
  drawImage(){
  	this.curImageSrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,'+ btoa(this.selectedIcon.svg()));
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
    this.drawImage();
  }
  moveright() {
		this.apiservice.moveright();
		this.drawImage();
	}
	moveleft() {
		this.apiservice.moveleft();
		this.drawImage();
	}
	moveup() {
		this.apiservice.moveup();
		this.drawImage();
	}
	movedown() {
		this.apiservice.movedown();
	}
	rotx() {
		this.apiservice.rotx();
		this.drawImage();
	}
	roty() {
		this.apiservice.roty();
		this.drawImage();
	}
	flipx() {
		this.apiservice.flipx();
		this.drawImage();
	}
	flipy() {
		this.apiservice.flipy();
		this.drawImage();
	}
	onSizeChange(event) {
		this.apiservice.zoomchange(this.shapesize/100);
		this.drawImage();
	}
	onRotationChange(event) {
		this.apiservice.rotation(this.rotation);
		this.drawImage();
	}
	removeIcon(){
		this.apiservice.removeIcon();
		this.selectedIcon.clear();
		this.transferRef.dismiss();
		this.apiservice.drawImage.emit();
	}
}
