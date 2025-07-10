import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentCuComponent } from './department-cu.component';

describe('DepartmentCuComponent', () => {
  let component: DepartmentCuComponent;
  let fixture: ComponentFixture<DepartmentCuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentCuComponent]
    });
    fixture = TestBed.createComponent(DepartmentCuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
