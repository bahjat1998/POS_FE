import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosApplyDiscountComponent } from './pos-apply-discount.component';

describe('PosApplyDiscountComponent', () => {
  let component: PosApplyDiscountComponent;
  let fixture: ComponentFixture<PosApplyDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosApplyDiscountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosApplyDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
