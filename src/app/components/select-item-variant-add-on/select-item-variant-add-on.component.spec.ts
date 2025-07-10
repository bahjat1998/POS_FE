import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectItemVariantAddOnComponent } from './select-item-variant-add-on.component';

describe('SelectItemVariantAddOnComponent', () => {
  let component: SelectItemVariantAddOnComponent;
  let fixture: ComponentFixture<SelectItemVariantAddOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectItemVariantAddOnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectItemVariantAddOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
