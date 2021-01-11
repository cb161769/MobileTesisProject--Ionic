import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpRequest,HttpResponse } from  '@angular/common/http';
import { Observable,throwError  } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ErrorService } from './error.service';

environment
@Injectable({
  providedIn: 'root'
})
export class DynamoDBAPIService {
  url:any = environment.DynamoBDEndPoints.ULR;
  getDeviceReadingsEndPoint:any = environment.DynamoBDEndPoints.API_PATHS.getDeviceReadings;

  constructor(public httpClient: HttpClient, public AwsAmplifyService:AwsAmplifyService, public ErrorService:ErrorService) { }
  
  /**
   * this method is 
   * @param ulrRoot the specified URL
   */
   genericGetMethods(ulrRoot:string): Observable<any[]>{
    const attributes =  this.AwsAmplifyService.getCurrentUser();
    console.log(attributes);
    
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
  genericPostMethod(ulrPost:string,bodyPost:any):Observable<any[]>{
    
    return this.httpClient.post(ulrPost,bodyPost, {headers: this.genericGetHeaders()}).pipe(
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
  genericGetHeaders():HttpHeaders {
    let headers = new HttpHeaders();
    
    headers = headers.append('Authorization', this.obtainCurrentTOken());
    return headers;
    
  }
  obtainCurrentTOken ():any{
    this.AwsAmplifyService.getCurrentUser().then((data) => {
      return data;
    })
  }

}
