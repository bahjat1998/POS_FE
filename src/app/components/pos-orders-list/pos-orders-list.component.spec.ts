import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosOrdersListComponent } from './pos-orders-list.component';

describe('PosOrdersListComponent', () => {
  let component: PosOrdersListComponent;
  let fixture: ComponentFixture<PosOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosOrdersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
