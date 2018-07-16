import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifSnackbarComponent } from './notif-snackbar.component';

describe('NotifSnackbarComponent', () => {
  let component: NotifSnackbarComponent;
  let fixture: ComponentFixture<NotifSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
