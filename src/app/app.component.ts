import {Component, OnInit} from '@angular/core';
import {NotifierService} from './NotifierService/notifier.service';
import {ErrorsHandler} from './ErrorsHandler/errors-handler';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable, TimeoutError} from 'rxjs';
import {async} from '@angular/core/testing';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Test';
  messageSnack = 'This is a snack bar!!!';
  actionSnack = 'Got it!';
  snackDuration = 5000;
  dialogMsgs: Array<string> = ['One message', 'Alert! Something Happened!'];
  addMessage: string = '';
  dialogTitle = 'Title';
  errorType = 'one';

  dataSnack = {
    error: 'stackystacky',
    code: 'Bad thing',
    title: 'Eww, a bug!',
    messages: ['This is definitely not a message','But this is a snackbar! (Yum)'],
    debug: 'This code has been broken',
    format: {
      openSnackbar: true
    },
    options: {
      notifType: 'error',
      snackbar: {
        //style: 3,
        //action: 'Stab!',
        //color: 'orange',
        //verticalPos: 'top',
        //horizontalPos: 'right',
        //duration: 2000
      },
    }
  };

  dataDialog = {
    error: 'stackystacky',
    code: 'Bad thing',
    title: 'Eww, a bug!',
    messages: ['This is definitely not a message','But this is a dialog!'],
    debug: 'This code has been broken',
    format: {
      openDialog: true,
    },
    options: {
      notifType: 'error',
      dialog: {
        //style: 1,
        color: 'red',
        //action: 'Dismiss',
        //disableClose: false,
        //autoFocus: true,
        //hasBackdrop: true,
        position: {
          //bottom: null,
          top: '0',
          //right: null,
          //left: null
        }
      }
    }
  };

  /*
  dataNotifObservable = {
    format: {
      notifObservable: true
    },
    options: {
      notifObservable:{
        observable: this.promiseBlah(),

        //response: ['array of anything'],
        //errorTitle: 'title of message to show client if an error occurs',
        errorMessage: ['Oh no! Better get that error checked out!'],
        //successTitle: 'title of ""',
        successMessage: ['Success! That\'s a relief.'],
        //hideSuccess: false,
        //hideError: false,
        //showErrorDialog: false, //default: show error snackbar
        //showSuccessDialog: false //default: show success snackbar
      }
    }
  };
  */

  dataHtml = {
    format: {
      dynamicHtml: true
    },
    options: {
      dynamicHtml:{
        output: 'buffer',
        observable: this.blahblah(),
        //state: '',
        //response: 'data returned from subscribing to the observable'
        loadingMessage: 'loading...',
        errorMessage: 'Something went wrong!',
        successMessage: 'Action successfully completed!',
      }
    }
  };

  constructor(public notifierService: NotifierService, public errorsHandler: ErrorsHandler){}

  blahblah(){
    return new Observable(observer => {
      console.log('blahblah');
      observer.next(1);
      observer.next(2);
      observer.error(3);
      observer.complete();
      return {unsubscribe() {}};
    });
  }

  promiseBlah(){
    return new Promise((resolve,reject) => {
      console.log('promiseBlah');

      this.notifierService.notify({
        format: {
          notifObservable: true
        },
        options: {
          notifObservable:{
            observable: new Promise((resolve, reject) =>{
              console.log('Not wow');
              reject(5);
            }),
            errorMessage: ['Oh no! Better get that error checked out!'],
            successMessage: ['Success! That\'s a relief.'],
          }
        }
      });
      //let variable =
      /*
      variable.catch(err => {
        console.log('Errornn: ' + err);
      });
      */
      reject(111);
    });
  }

  startNotifOb(){
    this.notifierService.notify({
      format: {
        notifObservable: true
      },
      options: {
        notifObservable:{
          observable: this.promiseBlah(),

          //response: ['array of anything'],
          //errorTitle: 'title of message to show client if an error occurs',
          errorMessage: ['Oh no! Better get that error checked out!'],
          //successTitle: 'title of ""',
          successMessage: ['Success! That\'s a relief.'],
          //hideSuccess: false,
          //hideError: false,
          //showErrorDialog: false, //default: show error snackbar
          //showSuccessDialog: false //default: show success snackbar
        }
      }
    });
  }


  printTest(){
    console.log(this.dataHtml.options.dynamicHtml.output);
  }

  throwError(errorType: string): void {
    try {
      switch(errorType.toLowerCase()){
        case 'one': {
          throw new TypeError('This is a type error');
        }
        case 'two': {
          throw new ReferenceError('This is a reference error');
        }
        case 'three': {
          throw new RangeError('This is a range error');
        }
        case 'four': {
          throw new HttpErrorResponse({});
        }
        case 'five': {
          throw new TimeoutError();
        }
      }
      throw new Error('Invalid type of error');

    }
    catch(err){
      this.errorsHandler.handleError(err);
    }
  }

  ngOnInit(){
  }
}


