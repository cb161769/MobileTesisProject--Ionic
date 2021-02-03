import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable,throwError, from  } from 'rxjs';
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
   * this method is 
   * @param ulrRoot the specified URL
   */
   genericGetMethods(ulrRoot:string): Observable<any>{
    // const headers = new HttpHeaders();
    // headers.append('Access-Control-Allow-Headers', 'Content-Type');
    // headers.append('Access-Control-Allow-Methods', 'GET');
    // headers.append('Access-Control-Allow-Origin', '*');
    // let options = {
    //   headers: headers
    // }
    return this.httpClient.get(ulrRoot).pipe(
      map((data: any[]) => {
        return data;
      }), catchError(error => {
        return this.ErrorService.handleError(error);
        
      })
    );
    
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
