import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-notif-dialog',
  templateUrl: './notif-dialog.component.html',
  styleUrls: ['./notif-dialog.component.css']
})
export class NotifDialogComponent implements OnInit {

  title: string;
  messages: Array<string>;
  action: string;

  constructor(
    private dialogRef: MatDialogRef<NotifDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.title = data.title;
    this.messages = data.messages;
    this.action = data.action;
  }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close();
  }

}
