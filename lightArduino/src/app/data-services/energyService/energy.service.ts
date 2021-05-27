import { Injectable } from '@angular/core';
import { Apollo, gql  } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class EnergyService {
  private requests: any = [];

  constructor(private apolloClient: Apollo) { }
  /**
   * this method returns wether is loading pending requests
   */
  public isLoadingPendingRequest(): boolean{
    return this.requests.length !== 0;
  }
  public  getReadingsStatistics()  {
    const start = new Date();
    start.setDate(start.getDate() - 31);

    const beginning = Math.ceil(Date.now() / 1000);
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
        ({data}) => {
          return data;
        }
      );




    } catch (error) {
      console.log(error);
    }


  }



}
