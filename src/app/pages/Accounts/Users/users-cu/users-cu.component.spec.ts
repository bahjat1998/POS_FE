import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCuComponent } from './users-cu.component';

describe('UsersCuComponent', () => {
  let component: UsersCuComponent;
  let fixture: ComponentFixture<UsersCuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersCuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersCuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
