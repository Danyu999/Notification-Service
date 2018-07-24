import {Injectable} from '@angular/core';
import { MatDialogConfig, MatDialog, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import {NotifSnackbarComponent} from './notif-snackbar/notif-snackbar.component';
import {NotifDialogComponent} from './notif-dialog/notif-dialog.component';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  private snackConfig = new MatSnackBarConfig();
  private dialogConfig = new MatDialogConfig();

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  notify(data: any){
    if(data.format) {
      if (data.format.sendConsole || data.format.sendConsole == null) {
        //send console message
        this.consoleLog(data.error, data.code, data.debug, data.options.disableConsoleError);
      }
      if (data.format.notifObservable) {
        //listen to the observable object
        this.runNotifObservable(data);
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

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  listenToObservable(data: any, observable: Observable<any>){
    data.response = Array<any>();
    const listener = observable.subscribe({
      next(response){
        data.response.push(response);
        console.log('response: ' + response);
      },
      error(err){
        console.error('NotifierService: ' + err);
        data.state = 'error';
      },
      complete(){
        console.log('NotifierService: Observable successful ');
        data.state = 'success';
      }
    });
  }

  async runNotifObservable(data: any){
    if(data.options && data.options.notifObservable){
      let observable: Observable<any>;
      console.log('NotifierService: Attempting to listen to observable...');
      if (data.options.notifObservable.observable instanceof Observable) {
        observable = data.options.notifObservable.observable;
      }
      else if(data.options.notifObservable.observable instanceof Promise){
        observable = fromPromise(data.options.notifObservable.observable);
      }
      else{
        console.error("NotifierService: Error, no observable for notifObservable found.");
      }
      if(observable instanceof Observable){
        this.listenToObservable(data.options.notifObservable, observable);
        await this.sleep(2000);
        console.log("notif: " + data.options.notifObservable.state);
        if (data.options.notifObservable.state === 'error' && !data.options.notifObservable.hideError) {
          if (!data.options.notifObservable.showErrorDialog) {
            this.setSnackBarColor('error');
            this.setSnackBarDuration();
            if (data.options.notifObservable.errorMessage) {
              this.setSnackBarData('', data.options.notifObservable.errorMessage,
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
        else if (data.options.notifObservable.state === 'success' && !data.options.notifObservable.hideSuccess) {
          if (!data.options.notifObservable.showSuccessDialog) {
            this.setSnackBarColor('success');
            this.setSnackBarDuration();
            if (data.options.notifObservable.successMessage) {
              this.setSnackBarData('', data.options.notifObservable.successMessage,
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
    }
    else{
      console.error('NotifierService: No notifObservable options to read from!');
    }
  }

  async runHtml(data: any){
    if(data.options && data.options.dynamicHtml){
      let observable: Observable<any>;
      console.log('NotifierService: Attempting to listen to observable...');
      if (data.options.dynamicHtml.observable instanceof Observable) {
        observable = data.options.dynamicHtml.observable;
      }
      else if(data.options.dynamicHtml.observable instanceof Promise){
        observable = fromPromise(data.options.dynamicHtml.observable);
      }
      else{
        console.error("NotifierService: Error, no observable for dynamicHtml found.");
      }
      if (observable instanceof Observable) {
        data.options.dynamicHtml.output = data.options.dynamicHtml.loadingMessage;
        this.listenToObservable(data.options.dynamicHtml, observable);
        await this.sleep(2000);
        if (data.options.dynamicHtml.state === 'error') {
          data.options.dynamicHtml.output = data.options.dynamicHtml.errorMessage;
        }
        else if (data.options.dynamicHtml.state === 'success') {
          data.options.dynamicHtml.output = data.options.dynamicHtml.successMessage;
        }
      }
    }
    else{
      console.error('NotifierService: No dynamicHtml options to read from!');
    }
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
      this.snackConfig.duration = 8000;
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
    //this.dialogConfig.panelClass = ['notifier-service-dialog']; //should be general

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
