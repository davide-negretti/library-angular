import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegacySelectAuthorComponent } from './legacy-select-author.component';

describe('SelectAuthorComponent', () => {
  let component: LegacySelectAuthorComponent;
  let fixture: ComponentFixture<LegacySelectAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegacySelectAuthorComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LegacySelectAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
