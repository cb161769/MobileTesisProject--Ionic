import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnergyService {
  private requests:any = [];
  private base_URL = environment.DynamoBDEndPoints.ULR;
  private graphQLUrl = environment.DynamoBDEndPoints.API_PATHS.graphQL;

  constructor(private httpClient: HttpClient,private toastController:ToastController) { }
  /**
   * this method returns wether is loading pending requests
   */
  public isLoadingPendingRequest():boolean{
    return this.requests.length !==0;
  }
  public async getReadingsStatistics():Promise<any>  {
    const start = new Date();
    start.setDate(start.getDate() - 31);

    const beginning = Math.floor(start.getTime()/1000);
    const end = Math.ceil(Date.now()/1000);
    try {
      const data = await this.GraphQLRequest(`
      query{
        deviceUsageData(startDate:${beginning},endDate:${end}){
          timestamp,
          dayUse,
          nightUse
        }
      }
    `);
    console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  
    
  }
  /**
   * 
   * @param requestQuery graphQl query 
   */
  private async GraphQLRequest(requestQuery:any): Promise<any>{
    let graphQL = this.base_URL + this.graphQLUrl;
    const requirement = this.httpClient.post(
      this.graphQLUrl,
      requestQuery
    ).toPromise();
    console.log(requestQuery);
    console.log(requirement);
    this.requests.push(requirement);
    requirement.then((data) =>{
      return data;
    }).catch(async (error) =>{
     console.log(error);
     const toast = await this.toastController.create({
       message:'ha ocurrido un error',
       duration:3000,
       color:'dark'
       ,
       position:'bottom'
     });
     toast.present(); 
    }).finally(() =>{
      this.requests.splice(
        this.requests.indexOf(requirement),1
      )
    });
    return requirement;
  }
}
