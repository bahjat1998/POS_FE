import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersCuComponent } from './suppliers-cu.component';

describe('SuppliersCuComponent', () => {
  let component: SuppliersCuComponent;
  let fixture: ComponentFixture<SuppliersCuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuppliersCuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersCuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
