import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersCuComponent } from './customers-cu.component';

describe('CustomersCuComponent', () => {
  let component: CustomersCuComponent;
  let fixture: ComponentFixture<CustomersCuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomersCuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersCuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
