import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryCustomerComponent } from './delivery-customer.component';

describe('DeliveryCustomerComponent', () => {
  let component: DeliveryCustomerComponent;
  let fixture: ComponentFixture<DeliveryCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
