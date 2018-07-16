import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';

@Component({
  selector: 'app-notif-snackbar',
  templateUrl: './notif-snackbar.component.html',
  styleUrls: ['./notif-snackbar.component.css']
})
export class NotifSnackbarComponent implements OnInit {

  messages: Array<string>;
  title: string;
  action: string;
  style: number;
  notifType: string;

  constructor(private snackbarRef: MatSnackBarRef<NotifSnackbarComponent>,
              @Inject(MAT_SNACK_BAR_DATA) data) {
    this.messages = data.messages;
    this.title = data.title;
    this.action = data.action;
    this.style = data.style;
    this.notifType = data.notifType;
  }

  ngOnInit() {
  }

  close(){
    this.snackbarRef.dismiss();
  }
}
