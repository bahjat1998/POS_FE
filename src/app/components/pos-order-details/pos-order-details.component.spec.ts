import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosOrderDetailsComponent } from './pos-order-details.component';

describe('PosOrderDetailsComponent', () => {
  let component: PosOrderDetailsComponent;
  let fixture: ComponentFixture<PosOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
