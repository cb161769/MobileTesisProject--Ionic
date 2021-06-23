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

  constructor(public DynamoDBService: DynamoDBAPIService, private apolloClient: Apollo, ) { }
   private querySubscription: Subscription;

   ngOnInit() {

  }
  async ionViewDidEnter(){
  await this.automate();
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

  }
  public async automate(){
    try {
     // this.querySubscription =
     const deviceName = 1;
     this.querySubscription =  this.apolloClient.watchQuery<any>({
        query: gql`
        {
          deviceId(deviceName:${deviceName}){
            isConnection,
            connectionName,
            turnOff,
            isDevice,
            deviceName
          }
        },

        `
      }).valueChanges.subscribe( async ({data, loading}) => {

        if (!loading) {
         if (Object.keys(data).length > 0) {
          debugger;
          if (data.deviceId.turnOff === true) {
            if (data.deviceId.isConnection == true) {
              
              debugger;
            }
            else{

            }
          }


         }
        }
      });
    } catch (error) {
      const logger = new LogModel();
    }
  }
  async logDevice(log: LogModel){
    const url = environment.LoggerEndPoints.ULR;
    const loggerPath = environment.LoggerEndPoints.DatabaseLogger;
    const urlFullPath = `${url}` + `${loggerPath}`;
    await this.DynamoDBService.genericLogMethod(urlFullPath, log).then(() => {
    });
  }
}
