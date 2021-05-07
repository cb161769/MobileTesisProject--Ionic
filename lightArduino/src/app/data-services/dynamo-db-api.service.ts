import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable,throwError, from, forkJoin  } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Auth } from 'aws-amplify';

environment
@Injectable({
  providedIn: 'root'
})
export class DynamoDBAPIService {
  url:any = environment.DynamoBDEndPoints.ULR;
  getDeviceReadingsEndPoint:any = environment.DynamoBDEndPoints.API_PATHS.getDeviceReadings;
  token:any;
  constructor(public httpClient: HttpClient, public AwsAmplifyService:AwsAmplifyService, public ErrorService:ErrorService) {

   
   }
  
  /**
   * this method is to Generic 
   * @param ulrRoot the specified URL
   */
   genericGetMethods(ulrRoot:string): Observable<any>{
    return this.httpClient.get(ulrRoot).pipe(
      map((data: any[]) => {
        return data;
      }), catchError(error => {
        return this.ErrorService.handleError(error);
        
      })
    );
    
  }
  async asyncGenericGetMethods(url:string){
    const resul = await this.httpClient.get(url).pipe(
      map((data: any[]) => {

      })
    ).toPromise();
    debugger;
    return resul;
  }
  async multipleGenericGetMethods(ConnectionsArray:Array<any>, connectionName,DevicesUrl?,ConnectionUrl?){
    let calls = [];
    for (let index = 0; index < ConnectionsArray.length; index++) {
      const element = ConnectionsArray[index];
      if (element == connectionName) {
        calls.push(this.httpClient.get(DevicesUrl));
        //debugger;
      }else{
        ConnectionUrl += `${element}`
       // debugger;
        calls.push(this.httpClient.get(ConnectionUrl));
      }
      
      
    }
    return forkJoin(calls);
  }
  
  /**
   * This is a generic method to Post all data regarding to register rows to a DynamoDB Table
   * @param ulrPost the url from the REST API
   * @param bodyPost the body to register the Information
   */
   genericPostMethod(ulrPost:string,bodyPost:any):Observable<any>{
    return this.httpClient.post(ulrPost,bodyPost).pipe(
      map((data: any[]) => {
        return data;
      }), catchError(error => {
        return this.ErrorService.handleError(error);
      })
    );

   
    
    
  }
  /**
   * this is a generic PATCH method
   */
  genericPatchMethod(urlPatch:string,bodyPost:any):Observable<any[]>{
    const attributes =  this.AwsAmplifyService.getCurrentUser();
    console.log(attributes); 
    return this.httpClient.patch(urlPatch,bodyPost).pipe(
      map((data: any[]) => {
        return data;
      }), catchError(error => {
        return this.ErrorService.handleError(error);
      })
    )
  }
  async genericGetHeaders():Promise<HttpHeaders> {
    let headers = new HttpHeaders();
    const userToken = (await Auth.currentSession()).getAccessToken().getJwtToken();
    console.log(userToken); 
    headers = headers.append('Authorization', userToken);
    return headers;
    
  }
  async obtainCurrentToken (){

    
  }
  

}
