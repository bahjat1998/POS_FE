import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupsComponent } from './lookups.component';

describe('LookupsComponent', () => {
  let component: LookupsComponent;
  let fixture: ComponentFixture<LookupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LookupsComponent]
    });
    fixture = TestBed.createComponent(LookupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
