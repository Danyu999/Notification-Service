import {Injectable} from '@angular/core';
import { MatDialogConfig, MatDialog, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import {NotifSnackbarComponent} from './notif-snackbar/notif-snackbar.component';
import {NotifDialogComponent} from './notif-dialog/notif-dialog.component';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  private snackConfig = new MatSnackBarConfig();
  private dialogConfig = new MatDialogConfig();

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}
  /* Example data json object

  DEFAULT
  -Error message to console, no notification
  -default snackbar: action x button, color: gray, position: center bottom
  -default dialog:

 {
  error: "error stack",
  code: "response code",
  title: 'title of client side message',
  messages: ["client side message","each element is a new line"],
  debug: "developer side message",
  format:{
    sendConsole: true,
    listenToObservable: false,
    dynamicHtml: false,
    openSnackbar: false,
    openDialog: false,
    sendEmail: false
  },
  options:{
    disableConsoleError: false,
    notifType: 'error/success/warn/generic',  //pre-set configs default = generic
    observable:{
      observable: new Observable,
      response: ['array of anything'],
      errorTitle: 'title of message to show client if an error occurs',
      errorMessage: 'message to show client if an error occurs',
      successTitle: 'title of ""',
      successMessage: '""',
      hideSuccess: false,
      hideError: false,
      showErrorDialog: false, //default: show error snackbar
      showSuccessDialog: false //default: show success snackbar
    }
    html:{
      errorMessage: 'blah',
      successMessage: 'blash',

    }
    snackbar:{
      preset: 'error, warn, success',
      style: 1,
      disableAction: false
      action: 'Close'  //can make action do other things (undo, navigate, etc)
      duration: 4000
      color: ""  //can add more colors
      horizontalPos: "center"
      verticalPos: "top"
    }
    dialog: {
      style: 1,
      color: 'red'
      action: 'Close',
      disableClose: false,
      autoFocus: true,
      hasBackdrop: true,
      position: {
        bottom: null,
        top: null,
        right: null,
        left: null
      }
     dynamicHtml: {

     }
    }
  }
 }
  */

  notify(data: any){
    if(data.format) {
      if (data.format.sendConsole || data.format.sendConsole == null) {
        //send console message
        this.consoleLog(data.error, data.code, data.debug, data.options.disableConsoleError);
      }
      if (data.format.listenToObservable) {
        //listen to the observable object
        this.runObservable(data);
      }
      if (data.format.dynamicHtml) {
        //run dynamic html
        this.runHtml(data);
      }
      if (data.format.openSnackbar) {
        //open snackbar
        this.configSnackBar(data);
        this.openSnackBar();
      }
      if (data.format.openDialog) {
        //open dialog
        this.configDialog(data);
        this.openDialog();
      }
      if (data.format.sendEmail) {
        //send email
        this.sendEmail(data);
      }
    }
    else{
      console.error('NotifierService: No formatting found!');
    }
  }

  consoleLog(error: string, code: string, debug: string, disableConsoleError: boolean) {
    if (disableConsoleError) { // (default)
      if(error) console.log('Error Stack: ' + error);
      if(code) console.log('Code: ' + code);
      if(debug) console.log('Debug: ' + debug);
    }
    else {
      if(error) console.error('Error Stack: ' + error);
      if(code) console.error('Code: ' + code);
      if(debug) console.error('Debug: ' + debug);
    }
  }

  handleError(error: any){ //default when no settings are given
    //handle error given. Always logs; decide whether to send notif to client or not
  }

  runObservable(data: any){
    if(data.options.observable){
      let notification: string;
      console.log('NotifierService: Attempting to listen to observable...');
      if (data.options.observable.observable instanceof Observable) {
        notification = this.listenToObservable(data);
        if (notification === 'error') {
          if (!data.options.observable.showErrorDialog) {
            this.setSnackBarColor('error');
            this.setSnackBarDuration();
            if (data.options.observable.errorMessage) {
              this.setSnackBarData('', data.options.observable.errorMessage,
                1, '', 'error');
            }
            else {
              this.setSnackBarData('', ['Whoops! An error occurred!'],
                1, '', 'error');
            }
            this.openSnackBar();
          }
          else {
            //openErrorDialog();
          }
        }
        else if (notification === 'success') {
          if (!data.options.observable.showSuccessDialog) {
            this.setSnackBarColor('success');
            this.setSnackBarDuration();
            if (data.options.observable.successMessage) {
              this.setSnackBarData('', data.options.observable.successMessage,
                1, '', 'success');
            }
            else {
              this.setSnackBarData('', ['Success! Operation complete.'],
                1, '', 'success');
            }
            this.openSnackBar();
          }
          else {
            //openSuccessDialog();
          }
        }
      }
      else {
        console.error("NotifierService: Error, no observable found.");
      }
    }
    else{
      console.error('NotifierService: No observable options to read from!');
    }
  }

  listenToObservable(data: any): string{
    data.options.observable.response = Array<any>();
    let returnMsg = '';
    const listener = data.options.observable.observable.subscribe({
      next(response){
        data.options.observable.response.push(response);
      },
      error(err){
        console.error('NotifierService: ' + err);
        if(!data.options.observable.hideError) {
          returnMsg = 'error';
        }
      },
      complete(){
        console.log('NotifierService: Observable successful')
        if(!data.options.observable.hideSuccess){
          returnMsg = 'success';
        }
      }
    });
    return returnMsg;
  }

  runHtml(data: any){

  }

  openSnackBar(){
    this.snackBar.openFromComponent(NotifSnackbarComponent, this.snackConfig);
    this.snackConfig = new MatSnackBarConfig();
  }

  configSnackBar(data: any) {
    if(data.options) {
      //notifType presets
      this.setSnackBarColor(data.options.notifType);

      if (data.options.snackbar) {
        //horizontal position option
        if (data.options.snackbar.horizontalPos) { //center is default
          this.snackConfig.horizontalPosition = data.options.snackbar.horizontalPos;
        }

        //vertical position option
        if (data.options.snackbar.verticalPos) { //bottom is default
          this.snackConfig.verticalPosition = data.options.snackbar.verticalPos;
        }

        //color option
        this.setSnackBarColor(data.options.snackbar.color);

        //duration option
        this.setSnackBarDuration(data.options.snackbar.duration);

        //style option
        switch (data.options.snackbar.style) {
          case 2: {
            //action button snackbar
            if (data.options.snackbar.action) {
              this.setSnackBarData(data.title, data.messages, data.options.snackbar.style,
                data.options.snackbar.action, data.options.notifType);
            }
            else {
              this.setSnackBarData(data.title, data.messages, data.options.snackbar.style, 'Dismiss', data.options.notifType);
            }
            break;
          }
          case 3: { //no action button snackbar
            this.setSnackBarData(data.title, data.messages, data.options.snackbar.style, '', data.options.notifType);
            break;
          }
          default: { //action without button (default)
            this.setSnackBarData(data.title, data.messages, 1, '', data.options.notifType);
          }
        }
      }
      else{
        //default style
        this.setSnackBarData(data.title, data.messages, 1, '', data.options.notifType);
      }
    }
    else{
      //default style
      this.setSnackBarData(data.title, data.messages, 1, '', '');
    }
  }

  //sets the snackConfig data property
  setSnackBarData(title: string, messages: Array<string>, style: number, action: string, notifType: string){
    this.snackConfig.data = {
      title: title,
      messages: messages,
      style: style,
      action: action,
      notifType: notifType
    };
  }

  //sets the snackConfig duration property
  setSnackBarDuration(duration?: number){
    if(duration){
      this.snackConfig.duration = duration;
    }
    else{
      this.snackConfig.duration = 10000;
    }
  }

  //sets the snackConfig color property
  setSnackBarColor(color: string){
    switch (color) {
      case 'green': case 'success': {
        this.snackConfig.panelClass = ['notifier-service-snack-green-background'];
        break;
      }
      case 'orange': case 'warn': case 'caution': {
        this.snackConfig.panelClass = ['notifier-service-snack-orange-background'];
        break;
      }
      case 'red': case 'error': case 'alert': {
        this.snackConfig.panelClass = ['notifier-service-snack-red-background'];
        break;
      }
      case 'blue': {
        this.snackConfig.panelClass = ['notifier-service-snack-blue-background'];
        break;
      }
      case 'purple': {
        this.snackConfig.panelClass = ['notifier-service-snack-purple-background'];
        break;
      }
    }
  }

  openDialog(){
    this.dialog.open(NotifDialogComponent, this.dialogConfig);
    this.dialogConfig = new MatDialogConfig();
  }

  configDialog(data: any) {
    //panel config (strip padding/margins)
    this.dialogConfig.panelClass = ['notifier-service-dialog']; //should be general

    if(data.options && data.options.dialog) {
      //title, messages, and action option
      this.dialogConfig.data = {
        title: data.title,
        messages: data.messages,
        action: data.options.dialog.action
      };
      //disableClose option
      if (data.options.dialog.disableClose) {
        this.dialogConfig.disableClose = true;
      }
      else {
        this.dialogConfig.disableClose = false;
      }
      //autoFocus option
      if (data.options.dialog.autoFocus === false) {
        this.dialogConfig.autoFocus = false;
      }
      else {
        this.dialogConfig.autoFocus = true;
      }
      //hasBackdrop option
      if (data.options.dialog.hasBackdrop === false) {
        this.dialogConfig.hasBackdrop = false;
      }
      else {
        this.dialogConfig.hasBackdrop = true;
      }
      //position option
      this.dialogConfig.position = data.options.dialog.position;

      //style option
      switch (data.options.dialog.style) {
        case 2: {

          break;
        }
        default: { //also case 1

        }
      }
    }
    else{
      //title, messages, and action text
      this.dialogConfig.data = {
        title: data.title,
        messages: data.messages,
        action: 'Dismiss'
      };

      //Default style

    }
  }

  sendEmail(data){

  }

  //DEPRECATED AFTER THIS POINT!!!!!!!!!!!!!!!
  //
  //
  //
  //
  //
  //
  //

  openOldDialog(title: string, messages: Array<string>): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      bottom: null,
      top: null,
      right: null,
      left: null
    };
    dialogConfig.data = {
      title: title,
      messages: messages,
      action: 'Close'
    };
    dialogConfig.panelClass = ['notifier-service-dialog'];

    this.dialog.open(NotifDialogComponent, dialogConfig);
  }

  openDurationSnackBar(message: string, duration: number, color?: string): void {
    this.snackConfig.duration = duration;
    if(color) this.setSnackBarColor(color);
    this.snackBar.open(message, '', this.snackConfig);
    this.snackConfig = new MatSnackBarConfig();
  }

  openActionSnackBar(message: string, action: string, color?: string): void {
    if(color) this.setSnackBarColor(color);
    this.snackBar.open(message, action, this.snackConfig);
    this.snackConfig = new MatSnackBarConfig();
  }
}
