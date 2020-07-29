import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconeditComponent } from './iconedit.component';

describe('IconeditComponent', () => {
  let component: IconeditComponent;
  let fixture: ComponentFixture<IconeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
