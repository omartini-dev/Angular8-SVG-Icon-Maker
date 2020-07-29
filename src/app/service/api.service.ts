import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient,  HttpHeaders  } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { SVG, G, Pattern, Text, TextPath, Image, Svg } from '@svgdotjs/svg.js';
declare var $: any;
@Injectable({
  providedIn: 'root'
})

export class ApiService {
	public iconsetNo = null;
	public iconset = [];
	public iconsetName = '';
	public icons=[];
	public relatedicons=[];
	public iconIds=[];
	public selectedIconIds=[];
	public iconsize=[];
	public bgs=[];
	public draw=null;
	public tmpdraw;
	public canvas = null;
	public plan =1;
	public transInfo = [{
		zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
	},{
		zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
	},{
		zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
	},{
		zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
	},{
		zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
	},{
		zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
	},{
		zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
	},{
		zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
	},{
		zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
	},{
		zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
	},];
	public mask;
	public opacity=0.6;
	public offsetX = 2;
	public offsetY = 2;
	public blur = 1;
	public filter: any;
	public shadowColor = '#00f';
	public shadowFlag = false;
	public page = 0;
	public totalpages = 0;
	public bgpage = 0;
	public totalbgpages = 0;
	public search = '';
	public imageSize = 100;
	public currentIcon = 0;
	public currentBg = '';
	public currentBgId = null;

	public dlgTarget=null;
	public downlink='';

	public drawList = [];
	public iconCnt =0;
	public shapespecs = {
		s_color:'#fff',
		e_color:'#fff',
		s_pos : 0,
		e_pos : 100,
		bgdegree : 0,
		gradient:[null,null,null, null,null,null,null,null, null,null]
	};
	public bgspecs = {
		s_color:'#fff',
		e_color:'#000',
		s_pos : 0,
		e_pos : 100,
		bgdegree : 90,
	};
	public iconfilter = null;
	public bgfilter = null;
	public iconsetFlip = false;
	public iconsetAngle = 0;
	@Output() iconChange: EventEmitter<any> = new EventEmitter();
	@Output() bgChange: EventEmitter<any> = new EventEmitter();
	@Output() bgSelect: EventEmitter<any> = new EventEmitter();
	@Output() linkChange: EventEmitter<any> = new EventEmitter();
	@Output() favChange: EventEmitter<any> = new EventEmitter();
	@Output() selectedIconChange: EventEmitter<any> = new EventEmitter();
	@Output() paySuccess: EventEmitter<any> = new EventEmitter();
	@Output() drawImage: EventEmitter<any> = new EventEmitter();
	constructor(private http: HttpClient,
							private sanitizer: DomSanitizer) {
		// this.getIcons(this.search);
		// this.getBackground();
	}
	initValue() {
		this.transInfo = [{
				zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
			},{
				zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
			},{
				zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
			},{
				zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
			},{
				zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
			},{
				zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
			},{
				zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
			},{
				zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
			},{
				zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
			},{
				zoom:1,xtrans:0,ytrans:0,rot:0,xflip:false,yflip:false,
			}];
		// this.transformIcon();
		// this.refreshIcon();
	}
	initState() {
		this.initValue();
		this.shadowFlag = false;
		this.page = 0;
		this.totalpages = 0;
		this.search = '';
		this.imageSize = 100;
		this.currentIcon = 0;
		this.currentBg = '';
		this.icons=[];
		this.relatedicons=[];
		this.iconIds=[];
		this.bgs=[];
		this.draw=null;
		this.tmpdraw=null;
	}
	getBackground() {
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		const options = { headers: headers };
		this.http.post(environment.apiUrl + 'getbgs/' + this.bgpage, {filter:this.bgfilter}, options).subscribe((res : any[])=>{
			this.bgs = [];
			let svg:SafeHtml;
			for(var i=0; i<res[0].length;i++){
				svg = this.sanitizer.bypassSecurityTrustResourceUrl(res[0][i].base64);
				this.bgs.push([res[0][i].id, svg, res[0][i].svg_reg,res[0][i].uuid ]);
			}
			this.totalbgpages = res[1];
			this.bgChange.emit(this.bgs);
		});
	}
	getIcons(search){
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		const options = { headers: headers };
		this.search = search;
		this.http.post(environment.apiUrl + 'searchicons/' + this.page, {search:search, filter:this.iconfilter}, options).subscribe((res : any[])=>{
			this.icons=[];
			this.iconIds=[];
			let svg:SafeHtml;
			for(var i=0; i<res[0].length;i++){
				svg = this.sanitizer.bypassSecurityTrustHtml(res[0][i].svg_reg.replace(/\\\"/g,"\""));
				this.icons.push([svg, res[0][i].id, res[0][i].label]);
				this.iconIds.push(res[0][i].id);
			}
			this.totalpages = res[1];
			this.iconChange.emit(this.icons);
		});
	}
	getRelatedIcons(search){
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		const options = { headers: headers };
		return this.http.post(environment.apiUrl + 'relatedicons', {searchTerms:search}, options);
	}
	getKey(){
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		const options = { headers: headers };
		let userdata = JSON.parse(localStorage.getItem('currentUser'));
		return this.http.post(environment.apiUrl + 'getKey',{id:userdata.id} ,options);
	}
	getPlan(){
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		const options = { headers: headers };
		let userdata = JSON.parse(localStorage.getItem('currentUser'));
		return this.http.post(environment.apiUrl + 'getPlan',{id:userdata.id} ,options);
	}
	pageNext() {
		if(this.page >= this.totalpages) return false;
		this.page += 1;
		this.getIcons(this.search);
	}
	pagePrev() {
		if(this.page == 0) return false;
		this.page -= 1;
		this.getIcons(this.search);
	}
	pageBgNext() {
		if(this.bgpage >= this.totalbgpages) return false;
		this.bgpage += 1;
		this.getBackground();
	}
	pageBgPrev() {
		if(this.bgpage == 0) return false;
		this.bgpage -= 1;
		this.getBackground();
	}
	refreshIcon() {
		this.tmpdraw.clear();
		let curIcon = this.draw.find('.editable').svg();
		let bglist = this.draw.find('.background');
		let mask = this.draw.find("mask")[0];

		this.draw.clear();
		for(var i=0; i < bglist.length; i++){
			this.draw.svg(bglist[i].svg()).last().addClass('background').size(100,100);

			let nodehref = bglist[i].node.href;
			let nodeValue = '';
			if(typeof(nodehref)!='undefined'){
				nodeValue = nodehref.baseVal;
			}
			if(nodeValue=="#background" && curIcon.length>0){
				this.draw.svg(curIcon[0]).last().addClass("editable").maskWith(mask);
			}
		}
	}
	rotateIconSet(angle){
		let tmp = 0;
		let views =0;
		this.iconsetAngle = angle;
		for(let i=0;i<10;i++){
			let draw = this.drawList[i];
			let wrap = draw.find(".wrap")[0];
			if(wrap)
				wrap.transform({ rotate: angle, flip:this.iconsetFlip,origin: [50, 50]});
			
			// if(icon)
			// 	icon.transform({ rotate: angle,origin: [50, 50], flip:this.iconsetFlip });
			// if(defs){
			// 	let gitem = defs.find("g");
			// 	for(let i=0;i<gitem.length;i++){
			// 		gitem[i].transform({ rotate: angle,origin: [50, 50], flip:this.iconsetFlip });
			// 	}
			// }
				
			
			// tmp = angle % 90;
			// if(tmp==0)
			// 	views = 100;
			// else
			// 	views = 150;
			// 	draw.viewbox(-(views-100)/2, -(views-100)/2, views, views);
		}
	}
	transformIcon(){
		let flip_o = this.getflip();

		this.draw.find('.editable').transform({
			translateX: this.transInfo[this.currentIcon].xtrans,
			translateY: this.transInfo[this.currentIcon].ytrans,
			rotate: this.transInfo[this.currentIcon].rot,
			flip:flip_o,
			scale:this.transInfo[this.currentIcon].zoom
		});
		this.selectedIconChange.emit();
		this.drawImage.emit();
	}
	zoomout() {
		this.transInfo[this.currentIcon].zoom -= 0.1;
		this.transformIcon();
	}
	zoomin() {
		this.transInfo[this.currentIcon].zoom += 0.1;
		this.transformIcon();
	}
	zoomchange(rate) {
		this.transInfo[this.currentIcon].zoom = rate;
		this.transformIcon();
	}
	moveright() {
		this.transInfo[this.currentIcon].xtrans += 2;
		this.transformIcon();
	}
	moveleft() {
		this.transInfo[this.currentIcon].xtrans -= 2;
		this.transformIcon();
	}
	moveup() {
		this.transInfo[this.currentIcon].ytrans -= 2;
		this.transformIcon();
	}
	movedown() {
		this.transInfo[this.currentIcon].ytrans += 2;
		this.transformIcon();
	}

	rotation(alpha) {
		this.transInfo[this.currentIcon].rot = alpha;

		this.transformIcon();
	}
	rotx() {
		this.transInfo[this.currentIcon].rot -= 5;
		this.transformIcon();
	}
	roty() {
		this.transInfo[this.currentIcon].rot += 5;
		this.transformIcon();
	}
	flipx() {
		this.transInfo[this.currentIcon].xflip = !this.transInfo[this.currentIcon].xflip;
		this.flip();
	}
	flipy() {
		this.transInfo[this.currentIcon].yflip = !this.transInfo[this.currentIcon].yflip;
		this.flip();
	}
	flip() {
		this.transformIcon();
	}
	getflip(){
		let flip_o;
		if(this.transInfo[this.currentIcon].xflip){
			if(this.transInfo[this.currentIcon].yflip){
				flip_o='both';
			} else {
				flip_o = 'x';
			}
		} else {
			if(this.transInfo[this.currentIcon].yflip){
				flip_o='y';
			} else {
				flip_o = false;
			}
		}
		return flip_o;
	}
	setIcon(rawsvgDom){
		if(this.iconCnt>9)return;
		this.tmpdraw.clear();
		// this.disabledropshadow();
		let draw = this.drawList[this.iconCnt];
		draw = draw.group().addClass('wrap');
		draw.transform({ rotate: this.iconsetAngle, flip:this.iconsetFlip,origin: [50, 50]});
		let rawbgsvg = this.currentBg;
		if(rawbgsvg==''){
			rawbgsvg = this.bgs[0][2];
			this.currentBgId = this.bgs[0][3];
		}
		let bglist = this.tmpdraw.svg(rawbgsvg).last().children();
		let mask = this.tmpdraw.find("mask")[0];
		let viewbox = rawsvgDom.getAttribute('viewBox').split(' ');
		$(rawsvgDom).find('title').remove();
		let rawsvg = rawsvgDom.innerHTML;
		
		let fillable = '#fff';
		let addedFlag = false;
		if(bglist.length>0){
			for(var i=0; i < bglist.length; i++){
				draw.svg(bglist[i].svg()).last().addClass('background');
				let nodeValue = '';
				let nodehref = bglist[i].node.href;
				if(typeof(nodehref)!='undefined'){
					nodeValue = nodehref.baseVal;
				}

				if(nodeValue=="#background" || nodeValue.indexOf("middle")>-1){
					if(typeof(bglist[i+1])!='undefined'){
						let nodehrefNext = bglist[i+1].node.href;
						let nodeValueNext = '';
						if(typeof(nodehrefNext)!='undefined'){
							nodeValueNext = nodehrefNext.baseVal;
						}
						if(nodeValueNext.indexOf("middle") < 0){
							draw.group().addClass('geditable').group().svg(rawsvg).maskWith(mask).fill(fillable).addClass('editable').size(60).center(50,50);
							addedFlag = true;
						}
					}
				}
			}
			if(! addedFlag)
				draw.group().addClass('geditable').group().svg(rawsvg).maskWith(mask).fill(fillable).addClass('editable').size(60).center(50,50);
		}
		let bg = draw.find('#background-gradient')[0];
		if(bg!=null && !(this.bgspecs.e_color=='#000' && this.bgspecs.s_color=='#fff')){
			bg.attr('gradientTransform', `rotate(${this.bgspecs.bgdegree} 0.5 0.5)`);
			bg.children()[0].attr('stop-color', this.bgspecs.e_color);
			bg.children()[0].attr('offset', this.bgspecs.s_pos+"%");
			bg.children()[1].attr('stop-color', this.bgspecs.s_color);
			bg.children()[1].attr('offset', this.bgspecs.e_pos+"%");
		}
		this.iconCnt += 1;
		this.initValue();
		if(this.filter)
			this.dropshadow(null, null,null,null);
		this.bgSelect.emit();
		this.drawImage.emit();
	}
	setBackground(){
		let rawsvg = this.currentBg;
		for(let i=0;i<this.iconCnt;i++){
			let draw = this.drawList[i];
			draw.unfilter();
			
			if(draw.find('.editable').length>0)
				draw.find('.editable')[0].unfilter();
			let curIcon = draw.find('.geditable').svg();

			let bglist = this.tmpdraw.svg(rawsvg).last().children();
			let mask = this.tmpdraw.find("mask")[0];
			let insertFlag = 0;
			this.tmpdraw.clear();
			this.mask = mask;
			draw.clear();
			draw = draw.group().addClass('wrap');
			draw.transform({ rotate: this.iconsetAngle, flip:this.iconsetFlip,origin: [50, 50]});
			for(var j=0; j < bglist.length; j++){
				draw.svg(bglist[j].svg()).last().addClass('background');
				let nodehref = bglist[j].node.href;
				let nodeValue = '';
				if(typeof(nodehref)!='undefined'){
					nodeValue = nodehref.baseVal;
				}

				if((nodeValue=="#background" || nodeValue.indexOf("middle")>-1) && curIcon.length>0){
					if(typeof(bglist[j+1])!='undefined'){
						let nodehrefNext = bglist[j+1].node.href;
						let nodeValueNext = '';
						if(typeof(nodehrefNext)!='undefined'){
							nodeValueNext = nodehrefNext.baseVal;
						}
						if(nodeValueNext.indexOf("middle") < 0){
							draw.svg(curIcon[0]).last().maskWith(mask);
							insertFlag = 1;
						}
					}
				}
			}

			if(insertFlag==0){
				draw.svg(curIcon[0]).last().maskWith(mask);
				insertFlag = 1;
			}
			if(this.shadowFlag)
				this.dropshadow(null, null, null, null);
		}
		this.bgSelect.emit();
		this.drawImage.emit();
	}

	dropshadow(opacity, size, dx, dy) {

		if(! this.shadowFlag) return false;
		if(opacity)
			this.opacity = opacity;
		if(size)
			this.blur = size;
		if(dx)
			this.offsetX = dx;
		if(dy)
			this.offsetY = dy;
		for(let i=0;i<this.iconCnt;i++){
			this.drawList[i].find('.editable')[0].unfilter();
			this.drawList[i].defs().find("filter").remove();
			this.filter = this.drawList[i].filter();
			let tmp = this.filter.gaussianBlur(this.blur).in(this.filter.$sourceAlpha).offset(this.offsetX,this.offsetY);
			this.filter.flood(this.shadowColor,this.opacity).composite(tmp,'in');
			
			this.filter.blend(this.filter.$source);
			this.filter.size('200%', '200%').move('-50%', '-50%');

			this.drawList[i].find('.editable')[0].filterWith(this.filter);
		}
	}
	dropshadow1(opacity, size, dx, dy) {
		if(! this.shadowFlag) return false;
		if(opacity)
			this.opacity = opacity;
		if(size)
			this.blur = size;
		if(dx)
			this.offsetX = dx;
		if(dy)
			this.offsetY = dy;
		for(let i=0;i<this.iconCnt;i++){
			this.drawList[i].find('.editable')[0].unfilter();
			this.drawList[i].defs().find("filter").remove();
			this.filter = this.drawList[i].filter();
			let blur = this.filter.gaussianBlur(6);
			var diff = this.filter.specularLighting(0, "#cccccc", "1.2", "70", 0);
			diff.attr({'lighting-color':'#cccccc'});
			var pLight = diff.pointLight(20, 20, 60);

			pLight.attr({
					x: 10,
					y: 10,
					z: 100,
			});
			diff.add(pLight);
			diff.in(blur);
			this.filter.composite(this.filter.source, diff, 'arithmetic')
					.attr({k1: 0, k2: 1, k3: 1, k4: 0, operator:'arithmetic'});
			this.drawList[i].find('.wrap')[0].filterWith(this.filter);
		}
	}
	disabledropshadow(){
		for(let i=0;i<this.iconCnt;i++){
			this.drawList[i].unfilter();
			if(this.drawList[i].find('.editable').length >0)
				this.drawList[i].find('.editable')[0].unfilter();
		}
	}
	removeIcon(){
		this.drawList[this.currentIcon].clear();
		for(let i=this.currentIcon+1;i<this.iconCnt;i++){
			this.svgCopy(this.drawList[i-1],this.drawList[i]);
			this.transInfo[i-1] = this.transInfo[i];
			this.shapespecs['gradient'][i-1] = this.shapespecs['gradient'][i];
			this.selectedIconIds[i-1] = this.selectedIconIds[i];
			if(i == this.iconCnt -1){
				this.drawList[i].clear();
				this.selectedIconIds[i] = null;
			}
		}
		this.iconCnt = this.iconCnt -1;

	}
	svgCopy(src, dst){
		src.clear();
		let eleList = dst.children();
		for(let i=0;i<eleList.length;i++){
			src.svg(eleList[i].svg());
		}
	}
	getlink(svg) {
    this.http.post(environment.apiUrl+'makelink', {svg:svg}).subscribe(
			(data : any) => {
				this.downlink = data;
				this.linkChange.emit(this.downlink);
			}
		);
  }
  saveFavorite(favName) {
  	if(this.iconCnt==0)return false;
  	let svg='';
		for(let i=0;i<this.iconCnt;i++){
			if(i!=0)
				svg += "||";
			svg += this.drawList[i].svg();
		}
		if(this.currentBg=='')
			this.currentBg = this.bgs[0][2];
		let userdata = JSON.parse(localStorage.getItem('currentUser'));
		this.iconsetName = favName;
		this.http.post(environment.apiUrl+'saveSVG', {svg:svg,bgsvg:this.currentBg, name:favName, id:userdata.id, svg_size: this.imageSize, ids:JSON.stringify(this.selectedIconIds), bgid:this.currentBgId}).subscribe(
			(data : any) => {
				this.iconsetNo = data[1];
			}
		);
  }
  updateFavorite(favName) {
  	if(this.iconCnt==0)return false;
  	let svg='';
		for(let i=0;i<this.iconCnt;i++){
			if(i!=0)
				svg += "||";
			svg += this.drawList[i].svg();
		}
		if(this.currentBg=='')
			this.currentBg = this.bgs[0][2];

		let userdata = JSON.parse(localStorage.getItem('currentUser'));
		this.http.post(environment.apiUrl+'updateSVG', {setNo:this.iconsetNo,svg:svg,bgsvg:this.currentBg, name:favName, id:userdata.id, svg_size: this.imageSize}).subscribe(
			(data : any) => {
				console.log(data);
			}
		);
	}
	duplicateFav(id){
		this.http.post(environment.apiUrl+'duplicateSVG', {id:id}).subscribe(
			(data : any) => {
				this.getFav();
			}
		);
	}
  getFav() {
  	let userdata = JSON.parse(localStorage.getItem('currentUser'));
  	this.http.post(environment.apiUrl+'getFavs', {id:userdata.id}).subscribe(
			(data : any) => {
				this.favChange.emit(data);
			}
		);
  }
	modifyIconSet(id, name){
		return this.http.post(environment.apiUrl+'modifyset', {id:id, name:name});
	}
	trashSet(id){
		return this.http.post(environment.apiUrl+'trashset', {id:id});
	}
	selectIcon(){
		this.selectedIconChange.emit();
	}
	pay(type, token) {
		let userdata = JSON.parse(localStorage.getItem('currentUser'));
		let id = userdata.id;
		return this.http.post(`${environment.apiUrl}stripe`, { type, token, id});
	}
	changePlan(type){
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 		const options = { headers: headers };
 		let userdata = JSON.parse(localStorage.getItem('currentUser'));
		let id = userdata.id;
		return this.http.post(environment.apiUrl + 'changePlan/',{type, id} ,options);
	}
}
