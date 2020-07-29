import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditlayoutComponent } from './editlayout.component';

describe('EditlayoutComponent', () => {
  let component: EditlayoutComponent;
  let fixture: ComponentFixture<EditlayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditlayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
