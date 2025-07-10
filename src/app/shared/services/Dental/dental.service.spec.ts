import { TestBed } from '@angular/core/testing';

import { DentalService } from './dental.service';

describe('DentalService', () => {
  let service: DentalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DentalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
