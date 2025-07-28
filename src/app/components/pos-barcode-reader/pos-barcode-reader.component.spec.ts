import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosBarcodeReaderComponent } from './pos-barcode-reader.component';

describe('PosBarcodeReaderComponent', () => {
  let component: PosBarcodeReaderComponent;
  let fixture: ComponentFixture<PosBarcodeReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosBarcodeReaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosBarcodeReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
