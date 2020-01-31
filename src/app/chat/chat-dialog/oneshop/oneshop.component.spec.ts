import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneshopComponent } from './oneshop.component';

describe('OneshopComponent', () => {
  let component: OneshopComponent;
  let fixture: ComponentFixture<OneshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
