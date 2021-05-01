import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, AlertController,ToastController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { ConfigDeviceModel } from 'src/app/models/config-device-model';
import { ConnectionConsumptions } from 'src/app/models/connection-consumptions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-connection-one-consumptions',
  templateUrl: './connection-one-consumptions.page.html',
  styleUrls: ['./connection-one-consumptions.page.scss'],
})
export class ConnectionOneConsumptionsPage implements OnInit {
  deviceName:string = '';
  loading:any;
  constructor( public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public navController:NavController,public toast:ToastService,
    public ToastController : ToastController,public alertController:AlertController, public router:Router, public messageService:MessageService, public dynamoDBService: DynamoDBAPIService) { }

  ngOnInit() {
  }
  ConfigDeviceModel:ConfigDeviceModel = new ConfigDeviceModel();
  AvailableCharts =[ 
    {
      name:'bar'
    },
    {
      name:'line'
    },
    {
      name:'pie' 
    }
    ];
    ConnectionConsumptionsModel:ConnectionConsumptions = new ConnectionConsumptions();
  doRefresh(event) {
    console.log('Begin async operation');
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  onChange(event){
    console.log(event.target.value);

  }
    /**
   * this method is to present a loading Indicator
   * @method PresentLoading
   * @type Promise
   */
     async PresentLoading(){
      this.loading = await this.loadingIndicator.create({
        message:'Cargando ...',
        spinner:'dots'
      });
      await this.loading.present();
  
    }
    /**
     * @description This Function gets the Device Name
     * @param username 
     * @returns String
     */
    getDeviceName(username:string):string{
      let url = environment.DynamoBDEndPoints.ULR;
      let url_path = environment.DynamoBDEndPoints.API_PATHS.getDeviceConfiguration;
      let deviceName;
      const urlFullPath = `${url}` + `${url_path}` + `/${username}`;
      this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
        next: (response) => {
          deviceName = response.configuration[0].deviceName;
          this.GetDeviceConfiguration(deviceName);     
          return deviceName;
        },
        error: async (response) => {
          const alert = await this.alertController.create({
            header:'Error',
            message: response,
          });
          await alert.present();
        },
        complete: () => {
          return deviceName;
        }
      })
      return deviceName;
    }
    async GetDeviceConfiguration(username:any){
      var url = environment.DynamoBDEndPoints.ULR;
      var urlPath = environment.DynamoBDEndPoints.API_PATHS.getArduinoDeviceConfiguration;
      const urlFullPath = `${url}` + `${urlPath}`+`/${username}`;
      this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
        next:async (response) => {
          if (response.status === 200) {
            this.ConfigDeviceModel.configurationId = response.deviceConfiguration[0].configurationId;
            this.ConfigDeviceModel.configurationMaximumKilowattsPerDay = response.deviceConfiguration[0].configurationMaximumKilowattsPerDay;
            this.ConfigDeviceModel.configurationDays = response.deviceConfiguration[0].configurationDays;
            this.ConfigDeviceModel.deviceId = response.deviceConfiguration[0].deviceId;
            this.ConfigDeviceModel.status = response.deviceConfiguration[0].status;
            this.ConfigDeviceModel.connectionsConfigurations = response.deviceConfiguration[0].connectionsConfigurations;
            this.ConfigDeviceModel.configurationName = response.deviceConfiguration[0].configurationName;
          } else {
            const alert = await this.alertController.create({
              header:'Error',
              message: 'ha ocurrido un error, intentelo nuevamente',
            });
            await alert.present();
            return;
          }
  
        },
        error: async(error) => {
          const alert = await this.alertController.create({
            header:'Error',
            message: error,
          });
          await alert.present();
        }
      })
    }

}
