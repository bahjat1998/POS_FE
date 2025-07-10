import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosAddExpensesComponent } from './pos-add-expenses.component';

describe('PosAddExpensesComponent', () => {
  let component: PosAddExpensesComponent;
  let fixture: ComponentFixture<PosAddExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosAddExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosAddExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
