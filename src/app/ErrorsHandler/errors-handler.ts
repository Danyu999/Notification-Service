import {ErrorHandler, Injectable} from '@angular/core';
import {NotifierService} from '../NotifierService/notifier.service';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorsHandler /*implements ErrorHandler*/ {
  constructor(public notifierService: NotifierService){}

  handleError(error: Error, duration?: number) {
    console.error(error.name + ": " + error.message);
    let message = "An unknown error occurred! Please scream for help";
    if(error instanceof HttpErrorResponse){
      //server or connection error
      console.log("Server/Connection Error");
      if(!navigator.onLine){
        //offline error
        console.log("Offline Error");
        message = "The server is offline. Please try again later";
      }
      else{
        //http error
        console.log("Server error");
        message = "There is a problem with the server. Please seek assistance";
      }
    }
    else{
      //client error
      console.log("Client Error");
      message = "There is an error! Please be patient as we work to fix it";
    }
    //handle different types of errors...
    //...
    //...
    //...
    //...
    //...
    if(duration){
      this.notifierService.openDurationSnackBar(message, duration, 'red');
    }
    else {
      this.notifierService.openActionSnackBar(message, 'Got it!', 'red');
    }
  }
}
