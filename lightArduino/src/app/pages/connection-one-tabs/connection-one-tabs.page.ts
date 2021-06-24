import { AwsSdkService } from './../../data-services/awsIoT/aws-sdk.service';
import { Apollo, gql } from 'apollo-angular';
import { DynamoDBAPIService } from './../../data-services/dynamo-db-api.service';
import { environment } from './../../../environments/environment';
import { LogModel } from './../../models/log-model';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DevicesEnum } from 'src/app/utils/utilities';

@Component({
  selector: 'app-connection-one-tabs',
  templateUrl: './connection-one-tabs.page.html',
  styleUrls: ['./connection-one-tabs.page.scss'],
})
export class ConnectionOneTabsPage implements OnInit, OnDestroy{
  devicesNames = Object.values(DevicesEnum);
  constructor(public DynamoDBService: DynamoDBAPIService, private apolloClient: Apollo, public AwsSdkService:AwsSdkService ) { }
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
        console.log(this.devicesNames);
        if (!loading) {
         if (Object.keys(data).length > 0) {
          if (data.deviceId.turnOff === true) {
            if (data.deviceId.isConnection == true) {

             for (let index = 0; index < this.devicesNames.length; index++) {
              const element = this.devicesNames[index];
              if (element == data.deviceId.connectionName) {
                const topic = '/turnOnDeviceOne';
                const payload = 'hello';
                await this.AwsSdkService.publishMessage(topic, payload);
              }

             }
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
