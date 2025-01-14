import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegacySearchAuthorComponent } from './legacy-search-author.component';

describe('SelectAuthorComponent', () => {
  let component: LegacySearchAuthorComponent;
  let fixture: ComponentFixture<LegacySearchAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegacySearchAuthorComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LegacySearchAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
