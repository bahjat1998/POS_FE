import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemNoteComponent } from './invoice-item-note.component';

describe('InvoiceItemNoteComponent', () => {
  let component: InvoiceItemNoteComponent;
  let fixture: ComponentFixture<InvoiceItemNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceItemNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceItemNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
