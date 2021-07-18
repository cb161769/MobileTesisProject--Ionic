import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError, from, forkJoin  } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Auth } from 'aws-amplify';
import { Network } from '@capacitor/network';

import { LoadingController, AlertController, NavController, ToastController, ActionSheetController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class DynamoDBAPIService {
  url: any = environment.DynamoBDEndPoints.ULR;
  getDeviceReadingsEndPoint: any = environment.DynamoBDEndPoints.API_PATHS.getDeviceReadings;
  token: any;
  constructor(public httpClient: HttpClient, public AwsAmplifyService: AwsAmplifyService, public ErrorService: ErrorService, public toastController: ToastController) {


   }

  /**
   * this method is to Generic
   * @param ulrRoot the specified URL
   */
   genericGetMethods(ulrRoot: string): Observable<any>{
    return this.httpClient.get(ulrRoot).pipe(
      map((data: any[]) => {
        return data;
      }), catchError(error => {
        return this.ErrorService.handleError(error);

      })
    );

  }

  async asyncGenericGetMethods(url: string){
    const resul = await this.httpClient.get(url).pipe(
      map((data: any[]) => {

      })
    ).toPromise();
    return resul;
  }
  async multipleGenericGetMethods(ConnectionsArray: Array<any>, connectionName, DevicesUrl?, ConnectionUrl?){
    const calls = [];
    for (let index = 0; index < ConnectionsArray.length; index++) {
      const element = ConnectionsArray[index];
      if (element == connectionName) {
        calls.push(this.httpClient.get(DevicesUrl).pipe(
          retry(3)
        )
        );
        // debugger;
      }else{
        ConnectionUrl += `${element}`;
        calls.push(this.httpClient.get(ConnectionUrl).pipe(
          retry(3)
        ));
      }


    }
    return forkJoin(calls);
  }

  /**
   * This is a generic method to Post all data regarding to register rows to a DynamoDB Table
   * @param ulrPost the url from the REST API
   * @param bodyPost the body to register the Information
   */
   genericPostMethod(ulrPost: string, bodyPost: any): Observable<any>{
    return this.httpClient.post(ulrPost, bodyPost).pipe(
      map((data: any[]) => {
        return data;
      }), catchError(error => {
        return this.ErrorService.handleError(error);
      })
    );




  }
  /**
   * @method genericPatchMethod()
   */
  genericPatchMethod(urlPatch: string, bodyPost: any): Observable<any[]>{
    const attributes =  this.AwsAmplifyService.getCurrentUser();
    console.log(attributes);
    return this.httpClient.patch(urlPatch, bodyPost).pipe(
      map((data: any[]) => {
        return data;
      }), catchError(error => {
        return this.ErrorService.handleError(error);
      })
    );
  }
  async genericGetHeaders(): Promise<HttpHeaders> {
    let headers = new HttpHeaders();
    const userToken = (await Auth.currentSession()).getAccessToken().getJwtToken();
    console.log(userToken);
    headers = headers.append('Authorization', userToken);
    return headers;

  }
  /**
   * @method genericLogMethod
   * @description this method logs to the dynamoDb Database
   * @param urlPost
   * @param bodyPost
   * @returns
   */
  genericLogMethod(urlPost: string, bodyPost: any){
    // debugger;
    Network.addListener('networkStatusChange', async status => {
      if (status.connected) {
        const log = {
          userName: bodyPost.userName,
          timeStamp: bodyPost.timeStamp,
          action: bodyPost.action,
          route: bodyPost.route,
          logLevel: bodyPost.logLevel,
          logError: bodyPost.logError
        };
        const promise = new Promise((resolve, reject) => {
          this.httpClient.post(urlPost, log)
          .toPromise().then(
            (res) => {
              resolve(res);
            },
            (msg) => {
              reject(msg);
            }

          );

        });
        return promise;
      }
      else{
        const toast = await this.toastController.create({
          message: 'ha ocurrido un error de conexion',
          duration: 2000
        });
        toast.present();
      }
    });



  }
  /**
   *
   * @param urlGet url for get the informarion
   * @author Claudio Raul Brito Mercedes
   * @returns {Promise<any>}
   */
  async genericGet(urlGet: string ): Promise<any>{
    Network.addListener('networkStatusChange', async status => {
      if (status.connected){
      const promise = new Promise((resolve, reject) => {
        this.httpClient.get(urlGet)
        .toPromise().then(
          (res) => {
            resolve(res);
          },
          (msg) => {
            reject(msg);
          }

        );

      });
      return promise;
      }
      else{
        const toast = await this.toastController.create({
          message: 'ha ocurrido un error de conexion',
          duration: 2000
        });
        toast.present();
      }

    });



  }



}
