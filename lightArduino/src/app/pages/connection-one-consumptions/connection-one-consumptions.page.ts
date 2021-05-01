import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, AlertController,ToastController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
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

}
