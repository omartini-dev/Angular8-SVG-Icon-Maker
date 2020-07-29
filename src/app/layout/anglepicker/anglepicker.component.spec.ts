import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnglepickerComponent } from './anglepicker.component';

describe('AnglepickerComponent', () => {
  let component: AnglepickerComponent;
  let fixture: ComponentFixture<AnglepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnglepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnglepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
