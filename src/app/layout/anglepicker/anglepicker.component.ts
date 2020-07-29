import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import { switchMap } from 'rxjs/operator/switchMap';
import { takeUntil } from 'rxjs/operator/takeUntil';
@Component({
  selector: 'app-anglepicker',
  templateUrl: './anglepicker.component.html',
  styleUrls: ['./anglepicker.component.css']
})
export class AnglepickerComponent implements OnInit {
  mouseup$: any;
  mousedown$: any;
  mousemove$: any;
  mousehold$: any;
  x: number;
  y: number;
  absx: number;
  absy: number;
  @Input() angle: number;
  @Input() disabled: boolean;
  @Output() setAngle: EventEmitter<any> = new EventEmitter();
  _sub: any;
  constructor(private _el: ElementRef) { }

  ngOnInit() {
    this.absx = this._el.nativeElement.getBoundingClientRect().left;
    this.absy = this._el.nativeElement.getBoundingClientRect().top;
    this.mousedown$ = fromEvent(this._el.nativeElement, 'mousedown');
    this.mousedown$.subscribe((e) => {
      if (this.disabled) return false;
      this.x = e.x - this.absx - 20;
      this.y = e.y - this.absy - 20;
      if(Math.round(this.x)==0){
        if(this.y >= 0)
          this.angle = 90;
        else
          this.angle = 270;
      } else {
        this.angle = Math.round(Math.atan(Math.round(this.y)/this.x)*180/Math.PI);
        if(this.x < 0){
          this.angle += 180;
        }else if(this.angle < 0){
          this.angle += 360;
        }
      }
      this.setAngle.emit(this.angle);
    })
    this.mousemove$ = fromEvent(this._el.nativeElement, 'mousemove');
    this.mouseup$ = fromEvent(this._el.nativeElement, 'mouseup');

    this.mouseup$.subscribe(()=>{
      this.unsub();
      this.register();
    });

    // switchMap is extremely helpful
    // map source observable to inner observable. remember it as switch to new observable.
    this.mousehold$ = this.mousedown$.switchMap(()=> this.mousemove$).takeUntil(this.mouseup$);

    this._sub = this.mousehold$.subscribe((e) => {
      if (this.disabled) return false;
      this.x = e.x - this.absx - 20;
      this.y = e.y - this.absy - 20;
      if(Math.round(this.x)==0){
        if(this.y >= 0)
          this.angle = 90;
        else
          this.angle = 270;
      } else {
        this.angle = Math.round(Math.atan(Math.round(this.y)/this.x)*180/Math.PI);
        if(this.x < 0){
          this.angle += 180;
        }else if(this.angle < 0){
          this.angle += 360;
        }
      }
      this.setAngle.emit(this.angle);
    })
  }
  unsub() {
    if(this._sub) {
      this._sub.unsubscribe();
    }
  }

  register() {
    this.mousehold$ = this.mousedown$.switchMap(()=> this.mousemove$).takeUntil(this.mouseup$);

    this._sub = this.mousehold$.subscribe((e) => {
      if (this.disabled) return false;
      this.x = e.x - this.absx - 20;
      this.y = e.y - this.absy - 20;
      if(Math.round(this.x)==0){
        if(this.y >= 0)
          this.angle = 90;
        else
          this.angle = 270;
      } else {
        this.angle = Math.round(Math.atan(Math.round(this.y)/this.x)*180/Math.PI);
        if(this.x < 0){
          this.angle += 180;
        }else if(this.angle < 0){
          this.angle += 360;
        }
      }
      this.setAngle.emit(this.angle);
    })
  }
}
