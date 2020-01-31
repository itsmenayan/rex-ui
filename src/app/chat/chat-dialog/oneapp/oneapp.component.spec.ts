import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneappComponent } from './oneapp.component';

describe('OneappComponent', () => {
  let component: OneappComponent;
  let fixture: ComponentFixture<OneappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
