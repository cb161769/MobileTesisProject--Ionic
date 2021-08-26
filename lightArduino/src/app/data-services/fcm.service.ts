import { DynamoDBAPIService } from './dynamo-db-api.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { environment } from 'src/environments/environment';
import { LogModel } from '../models/log-model';
@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor(private router: Router,private dynamoDBService: DynamoDBAPIService) {}
   baseUrl = environment.DynamoBDEndPoints.ULR;
   urlPath = environment.DynamoBDEndPoints.API_PATHS.token.insertToken;

  initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }
  private registerPush() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      this.insertToken(token);
      // alert('Push registration success, token: ' + token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      //   alert('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //    alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        // alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }
  private insertToken(values){
    const url = environment.LoggerEndPoints.ULR;
    const loggerPath = environment.DynamoBDEndPoints.API_PATHS.token.insertToken;
    const urlFullPath = `${url}` + `${loggerPath}`;
    const value = {
      token:values
    };
    this.dynamoDBService.genericPostMethod(urlFullPath,value).subscribe({
      next:(async response =>{
        if (response.status==true) {
          const logger = new LogModel();
          logger.level = 'INFO';
          logger.action = 'insert token';
          logger.userName = '';
          this.logDevice(logger);
        }else{
          const logger = new LogModel();
          logger.level = 'ERROR';
          logger.action = 'insert token';
          logger.userName = '';
          logger.logError = response.error || '';
          this.logDevice(logger);
        }
      })
    })
  }
 private  logDevice(log:LogModel){
    const url = environment.LoggerEndPoints.ULR;
    const loggerPath = environment.LoggerEndPoints.DatabaseLogger;
    const urlFullPath = `${url}` + `${loggerPath}`;
    this.dynamoDBService.genericLogMethod(urlFullPath, log);
  }
}
