import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorNameVariantsComponent } from './author-name-variants.component';

describe('ReviewAuthorComponent', () => {
  let component: AuthorNameVariantsComponent;
  let fixture: ComponentFixture<AuthorNameVariantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorNameVariantsComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AuthorNameVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
