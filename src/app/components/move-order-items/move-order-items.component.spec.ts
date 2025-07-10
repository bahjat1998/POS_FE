import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveOrderItemsComponent } from './move-order-items.component';

describe('MoveOrderItemsComponent', () => {
  let component: MoveOrderItemsComponent;
  let fixture: ComponentFixture<MoveOrderItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveOrderItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveOrderItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
