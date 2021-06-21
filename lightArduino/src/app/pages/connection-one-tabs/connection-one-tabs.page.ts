import { Apollo, gql } from 'apollo-angular';
import { DynamoDBAPIService } from './../../data-services/dynamo-db-api.service';
import { environment } from './../../../environments/environment';
import { LogModel } from './../../models/log-model';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-connection-one-tabs',
  templateUrl: './connection-one-tabs.page.html',
  styleUrls: ['./connection-one-tabs.page.scss'],
})
export class ConnectionOneTabsPage implements OnInit, OnDestroy{

  constructor(public DynamoDBService: DynamoDBAPIService,private apolloClient: Apollo,) { }
   private querySubscription: Subscription;

  ngOnInit() {

  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
  }
  public async automate(){
    try {
     // this.querySubscription = 
     const deviceName = '';
      this.querySubscription =  this.apolloClient.watchQuery<any>({
        query: gql`
        {
          sns(timeStamp:${deviceName}){
            device_amps,
            device_name,
            device_UserName,
            device_watts,
            wifi_IP,
            wifi_name,
            wifi_strength
          }
        },

        `
      }).valueChanges.subscribe( async ({data, loading}) =>{
        if (!loading) {
         if (Object.keys(data).length > 0) {
           
         } 
        }
      })
    } catch (error) {
      const logger = new LogModel();
    }
  } 
  async logDevice(log:LogModel){
    const url = environment.LoggerEndPoints.ULR;
    const loggerPath = environment.LoggerEndPoints.DatabaseLogger;
    const urlFullPath = `${url}` + `${loggerPath}`;
    await this.DynamoDBService.genericLogMethod(urlFullPath, log).then(() =>{
    });
  }
}
