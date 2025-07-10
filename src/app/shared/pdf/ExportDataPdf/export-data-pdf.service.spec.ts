import { TestBed } from '@angular/core/testing';

import { ExportDataPdfService } from './export-data-pdf.service';

describe('ExportDataPdfService', () => {
  let service: ExportDataPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportDataPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
