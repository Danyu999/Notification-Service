import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {OverlayModule} from '@angular/cdk/overlay';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatRippleModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {NotifSnackbarComponent} from './NotifierService/notif-snackbar/notif-snackbar.component';
import {NotifDialogComponent} from './NotifierService/notif-dialog/notif-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NotifSnackbarComponent,
    NotifDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    OverlayModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [/*{
    provide: ErrorHandler,
    useClass: ErrorsHandler
  }*/],
  bootstrap: [AppComponent],
  entryComponents: [NotifDialogComponent, NotifSnackbarComponent]
})
export class AppModule { }
