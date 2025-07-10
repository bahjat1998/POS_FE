import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPageLayoutComponent } from './pos-page-layout.component';

describe('PosPageLayoutComponent', () => {
  let component: PosPageLayoutComponent;
  let fixture: ComponentFixture<PosPageLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosPageLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
