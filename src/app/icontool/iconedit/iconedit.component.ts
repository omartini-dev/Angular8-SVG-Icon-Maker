import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
@Component({
  selector: 'app-iconedit',
  templateUrl: './iconedit.component.html',
  styleUrls: ['./iconedit.component.css']
})
export class IconeditComponent implements OnInit {
	public opacity = 100;
	public angle = 45;
	public distance = 4;
	public size = 2;
	public shadowColor = '#56565c';
	public enableShadow=false;
	public bgspecs = {
		s_color:'#fff',
		e_color:'#eef',
		s_pos : 0,
		e_pos : 100,
		bgdegree : 90,
	};
	public shapespecs = {
		s_color:'#fff',
		e_color:'#fff',
		s_pos : 0,
		e_pos : 100,
		bgdegree : 0,
		gradient:[null,null,null, null,null,null,null,null, null,null]
	};
	public sub=null;
  constructor(private apiservice: ApiService) { }

	ngOnInit() {
		this.sub = this.apiservice.bgSelect.subscribe(res => {
			let bg = this.apiservice.drawList[0].find('#background-gradient')[0];
			if(typeof(bg)!='undefined'){
				this.bgspecs.e_color = bg.children()[0].attr('stop-color');
				this.bgspecs.s_pos = bg.children()[0].attr('offset').replace('%','');
				this.bgspecs.s_color = bg.children()[1].attr('stop-color');
				this.bgspecs.e_pos = bg.children()[1].attr('offset').replace('%','');
				let anglestr = bg.attr('gradientTransform');
				if(typeof(anglestr)!='undefined'){
					let angle = anglestr.replace('rotate(','').replace(' 0.5 0.5)');
					this.bgspecs.bgdegree = parseInt(angle);
				} else {
					this.bgspecs.bgdegree = 0;
				}
				this.apiservice.bgspecs = this.bgspecs;
				this.shapespecs = this.apiservice.shapespecs;
				this.onShapeChange();
			}
		});

	}
	ngOnDestroy(){
    this.sub.unsubscribe();
  }
	onBgChange(){
		this.apiservice.bgspecs = this.bgspecs;
		for(let i=0;i<10;i++){
			let bg = this.apiservice.drawList[i].find('#background-gradient')[0];
			if(bg==null) continue;
			bg.attr('gradientTransform', `rotate(${(this.bgspecs.bgdegree + 90)%360} 0.5 0.5)`);
			bg.children()[0].attr('stop-color', this.bgspecs.e_color);
			bg.children()[0].attr('offset', this.bgspecs.s_pos+"%");
			bg.children()[1].attr('stop-color', this.bgspecs.s_color);
			bg.children()[1].attr('offset', this.bgspecs.e_pos+"%");
		}
		this.apiservice.drawImage.emit();
	}
	onShapeChange(){
		for(let i=0;i<this.apiservice.iconCnt;i++){
			if(this.apiservice.drawList[i].find('.shapgradient').length==0){
				this.shapespecs.gradient[i] = this.apiservice.drawList[i].gradient('linear', function(add){
					add.stop(0, '#fff');
					add.stop(1, '#fff');
				}).addClass('shapgradient');
			}
			let shapegradient = this.apiservice.drawList[i].find('.shapgradient')[0];
			shapegradient.get(0).update(this.shapespecs.s_pos/100, this.shapespecs.s_color);
			shapegradient.get(1).update(this.shapespecs.e_pos/100, this.shapespecs.e_color);
			shapegradient.attr('gradientTransform', `rotate(${this.shapespecs.bgdegree} 0.5 0.5)`);
			if(this.apiservice.drawList[i].find('.editable').length>0)
					this.apiservice.drawList[i].find('.editable')[0].fill(shapegradient);
		}
		this.apiservice.shapespecs = this.shapespecs;
		this.apiservice.drawImage.emit();
	}
	applyShadow(){
		if(this.enableShadow){
			this.apiservice.shadowFlag = true;
			this.onChangeShadow();
		} else {
			this.apiservice.shadowFlag = false;
			this.apiservice.disabledropshadow();
		}
		this.apiservice.drawImage.emit();
	}
	onChangeShadow(){
		let opacity = this.opacity/100;
		this.apiservice.shadowColor = this.shadowColor;
		let dx = Math.cos(Math.PI/180*this.angle)*this.distance;
		let dy = Math.sin(Math.PI/180*this.angle)*this.distance;
		this.apiservice.dropshadow(opacity, this.size, dx, dy);
		this.apiservice.drawImage.emit();
	}
	setAngle($event){
		this.bgspecs.bgdegree = $event;
		this.onBgChange();
	}
	setShapeAngle($event){
		this.shapespecs.bgdegree = $event;
		this.onShapeChange();
	}
	setShadowAngle($event){
		this.angle = $event;
		this.onChangeShadow();
	}
}
