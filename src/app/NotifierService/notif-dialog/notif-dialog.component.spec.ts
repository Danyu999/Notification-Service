import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifDialogComponent } from './notif-dialog.component';

describe('NotifDialogComponent', () => {
  let component: NotifDialogComponent;
  let fixture: ComponentFixture<NotifDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
