import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayOrderPopupComponent } from './pay-order-popup.component';

describe('PayOrderPopupComponent', () => {
  let component: PayOrderPopupComponent;
  let fixture: ComponentFixture<PayOrderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayOrderPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayOrderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
