import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudShiftComponent } from './crud-shift.component';

describe('CrudShiftComponent', () => {
  let component: CrudShiftComponent;
  let fixture: ComponentFixture<CrudShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
