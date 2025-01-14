import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsToolbarComponent } from './authors-toolbar.component';

describe('AuthorsToolbarComponent', () => {
  let component: AuthorsToolbarComponent;
  let fixture: ComponentFixture<AuthorsToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorsToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
