import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LnrGraphicsComponent } from './lnr-graphics.component';

describe('LnrGraphicsComponent', () => {
  let component: LnrGraphicsComponent;
  let fixture: ComponentFixture<LnrGraphicsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LnrGraphicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LnrGraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
