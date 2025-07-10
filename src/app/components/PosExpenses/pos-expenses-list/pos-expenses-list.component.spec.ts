import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosExpensesListComponent } from './pos-expenses-list.component';

describe('PosExpensesListComponent', () => {
  let component: PosExpensesListComponent;
  let fixture: ComponentFixture<PosExpensesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosExpensesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosExpensesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
