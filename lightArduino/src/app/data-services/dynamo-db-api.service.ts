import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { Observable } from 'rxjs';

environment
@Injectable({
  providedIn: 'root'
})
export class DynamoDBAPIService {
  url:any = environment.DynamoBDEndPoints.ULR;


  constructor(public httpClient: HttpClient, public AwsAmplifyService:AwsAmplifyService) { }
  async getRegisteredDevice(){

  }
}
