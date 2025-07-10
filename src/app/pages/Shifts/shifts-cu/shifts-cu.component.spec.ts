import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsCuComponent } from './shifts-cu.component';

describe('ShiftsCuComponent', () => {
  let component: ShiftsCuComponent;
  let fixture: ComponentFixture<ShiftsCuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftsCuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftsCuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
