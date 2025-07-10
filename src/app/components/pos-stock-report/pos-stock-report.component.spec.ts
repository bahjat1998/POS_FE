import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosStockReportComponent } from './pos-stock-report.component';

describe('PosStockReportComponent', () => {
  let component: PosStockReportComponent;
  let fixture: ComponentFixture<PosStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosStockReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
