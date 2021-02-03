import { DynamoDBAPIService } from './../dynamo-db-api.service';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Apollo,gql  } from "apollo-angular";

@Injectable({
  providedIn: 'root'
})
export class EnergyService {
  private requests:any = [];
  private base_URL = environment.DynamoBDEndPoints.ULR;
  private graphQLUrl = environment.DynamoBDEndPoints.API_PATHS.graphQL;

  constructor(private httpClient: HttpClient,private toastController:ToastController, private DynamoDBAPIService: DynamoDBAPIService,private apolloClient: Apollo) { }
  /**
   * this method returns wether is loading pending requests
   */
  public isLoadingPendingRequest():boolean{
    return this.requests.length !==0;
  }
  public  getReadingsStatistics()  {
    const start = new Date();
    start.setDate(start.getDate() - 31);

    const beginning = Math.ceil(Date.now()/1000);
    try {
      this.apolloClient.query<any>({
        query: gql`
        {
          device(timeStamp:${beginning}){
            device_amps,
            device_name,
            device_UserName,
            device_watts,
            wifi_IP,
            wifi_name,
            wifi_strength
          }
        }
        `
      }).subscribe(
        ({data}) =>{
          console.log(data);
          return data;
        }
      )
     

    

    } catch (error) {
      console.log(error);
    }
  
    
  }
  

  
}
