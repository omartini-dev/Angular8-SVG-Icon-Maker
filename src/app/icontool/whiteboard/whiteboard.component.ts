import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SVG} from '@svgdotjs/svg.js';
import { TransformComponent} from "../transform/transform.component";
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import '@svgdotjs/svg.filter.js';

declare var $: any;
const defaultConfig = new MatBottomSheetConfig();
@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.css']
})
export class WhiteboardComponent implements OnInit {

	public draw;
	public tmpdraw;
	public imageSize=100;
	public imgsrc:SafeHtml =[];
	public sub=null;
	public angle=0;
	public flip_x=false;
	public flip_y=false;
	config: MatBottomSheetConfig = {
    hasBackdrop: defaultConfig.hasBackdrop,
    backdropClass: defaultConfig.backdropClass,
    direction: 'ltr',
  };
	constructor(private apiservice: ApiService,
							private sanitizer: DomSanitizer,
							private _bottomSheet: MatBottomSheet) { }

	ngOnInit() {
		let draw;
		this.apiservice.iconCnt = 0;
		this.apiservice.drawList = [];
		for(let i=1;i<11;i++){
			draw = SVG().addTo('#drawing'+i).size(this.apiservice.imageSize, this.apiservice.imageSize);
			draw.viewbox(0, 0, 100, 100);
			this.apiservice.drawList.push(draw);
		}
		this.apiservice.shapespecs = {
			s_color:'#fff',
			e_color:'#fff',
			s_pos : 0,
			e_pos : 100,
			bgdegree : 0,
			gradient:[null,null,null, null,null,null,null,null, null,null]
		};
		this.apiservice.imageSize = 100;
		this.onChangeSize();
		this.apiservice.shadowFlag = false;
		this.apiservice.disabledropshadow();
		if(this.apiservice.iconsetNo!=null){
			for(let i=0;i<this.apiservice.iconset.length;i++){
				$("#tmp4set").html(this.apiservice.iconset[i].changingThisBreaksApplicationSecurity);
				let width = $("#tmp4set svg").attr('width');
				this.imageSize = width;
				this.apiservice.drawList[i].svg($("#tmp4set svg").html());
				this.apiservice.drawList[i].size(width,width);
				this.apiservice.drawList[i].attr('transform', $("#tmp4set svg").attr('transform'));
				let viewbox = $("#tmp4set svg").attr('viewBox').split(' ');
				console.log(viewbox);
				this.apiservice.drawList[i].viewbox(parseInt(viewbox[0]), parseInt(viewbox[1]), parseInt(viewbox[2]), parseInt(viewbox[3]));
			}
			
			if(this.imageSize!=this.apiservice.imageSize){
				this.onChangeSize();
				this.apiservice.imageSize = this.imageSize;
			}
			this.apiservice.iconCnt = this.apiservice.iconset.length;
			this.drawImage();
		}
		this.apiservice.iconset = [];

		this.apiservice.draw = this.apiservice.drawList[0];
		this.tmpdraw = SVG().addTo('#tmp');
		this.apiservice.tmpdraw = this.tmpdraw;
		this.sub = this.apiservice.drawImage.subscribe(res => {
			this.drawImage();
		});
	}
	drawImage(){
		for(let i=0;i<this.apiservice.drawList.length;i++){
			this.imgsrc[i] = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,'+ btoa(this.apiservice.drawList[i].svg()));
		}
	}
	ngOnDestroy(){
    this.apiservice.iconset = [];
    this.apiservice.iconsetNo = null;
    this.apiservice.iconsetName = '';
  }
	onChangeSize (){
		let draw;
		let drawlist = [];
		this.apiservice.imageSize = this.imageSize;
		for(let i=0;i<10;i++){
			this.apiservice.drawList[i].size(this.imageSize, this.imageSize);
			// this.apiservice.drawList[i].viewbox(0, 0, 100, 100);
		}
		this.drawImage();
	}
	selectIcon(id) {
		if(id>=this.apiservice.iconCnt) return;
		this.apiservice.draw = this.apiservice.drawList[id];
		this.apiservice.currentIcon = id;
		this._bottomSheet.open(TransformComponent, this.config);
		this.apiservice.selectIcon();
	}
	onChangeAngle(){
		this.apiservice.rotateIconSet(this.angle);
	}
	setAngle($event){
		this.angle = $event;
		this.onChangeAngle();
		this.drawImage();
	}
	flipSet(axis){
		let flip_o;
		if(axis=='x') this.flip_x = !this.flip_x;
		if(axis=='y') this.flip_y = !this.flip_y;
		if(this.flip_x){
			if(this.flip_y)
				flip_o = 'both';
			else
				flip_o = 'x';
		} else {
			if(this.flip_y)
				flip_o = 'y';
			else
				flip_o = false;
		}
		this.apiservice.iconsetFlip = flip_o;
		for(let i=0;i<10;i++){
			let draw = this.apiservice.drawList[i];
			let wrap = draw.find(".wrap")[0];
			if(wrap)
				wrap.transform({rotate: this.apiservice.iconsetAngle, flip: flip_o,origin: [50, 50]});
		}
		this.drawImage();
	}
}
