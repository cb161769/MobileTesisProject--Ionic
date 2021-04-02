import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, NavController,ToastController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { MQTTServiceService } from 'src/app/data-services/MQTTService/mqttservice.service';
import { ConfigDeviceModel } from 'src/app/models/config-device-model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-device',
  templateUrl: './my-device.page.html',
  styleUrls: ['./my-device.page.scss'],
})
export class MyDevicePage implements OnInit {
  ConfigDeviceModel:ConfigDeviceModel = new ConfigDeviceModel();
  loading:any;
  userDevice:string ='';
  
  constructor(public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public router:Router, public DynamoDBService: DynamoDBAPIService, 
    public ToastController : ToastController, public messageService:MessageService, public alertController: AlertController, public energyService:EnergyService,private apolloClient: Apollo, public navController:NavController, public MQTTServiceService:MQTTServiceService) { }

  async ngOnInit() {
    try {
      await this.validateLoggedUser();
    } catch (error) {
      console.log(error);
    }
  }
  singOut():void{

  }
  /**
   * @method doRefresh
   * @param event 
   */
  async doRefresh(event) {
    
    setTimeout(async () => {
      await this.validateLoggedUser();
      event.target.complete();
    }, 5000);
  }
  /**
   * @method configDevice
   * 
   */
  configDevice():void{
    
  }
  async validateLoggedUser(){
    await this.presentLoading();
    this.awsAmplifyService.getCurrentUser().then(async (result)=>{
      if (result != undefined) {
        try {
           this.userDevice = this.getDeviceName(result.attributes.email)

        // await this.getAllFares();
      } catch (error) {
        console.log(error);
        
      }
        
      } else {
        const toast = await this.ToastController.create({
          message: 'Ha ocurrido un error, ingrese nuevamente al sistema',
          duration: 2000,
          position: 'bottom',
          color: 'dark'
        });
        toast.present();

       this.redirectToLoginPage(); 
        
      }
    }).catch((error) =>{
      console.log(error);
    }).finally(() =>{
      this.loading.dismiss();
    })
  }
  getDeviceName(username:string):string{
    let url = environment.DynamoBDEndPoints.ULR;
    let url_path = environment.DynamoBDEndPoints.API_PATHS.getDeviceConfiguration;
    let deviceName;
    const urlFullPath = `${url}` + `${url_path}` + `/${username}`;
    this.DynamoDBService.genericGetMethods(urlFullPath).subscribe({
      next: (response) => {
       
        deviceName = response.configuration[0].deviceName;
        console.log(deviceName)
        this.getDeviceConfiguration(deviceName);
        return deviceName;
      },
      error: (response) => {
        console.log(response);
      },
      complete: () => {
        return deviceName;
      }
    })
    return deviceName;
  }
  async presentLoading(){
    this.loading = await this.loadingIndicator.create({
      message: 'Cargando ...',
      spinner: 'dots',
    });
    await this.loading.present();
  }
  async getDeviceConfiguration(device:string){
    await this.presentLoading();
    let url = environment.DynamoBDEndPoints.ULR;
    let urlPath = environment.DynamoBDEndPoints.API_PATHS.getArduinoDeviceConfiguration;  
    const urlFullPath = `${url}` + `${urlPath}` + `/${device}`
    this.DynamoDBService.genericGetMethods(urlFullPath).subscribe({
      next: async (result) => {
        if (result != undefined) {
          this.ConfigDeviceModel.configurationId = result.deviceConfiguration[0].configurationId;
          this.ConfigDeviceModel.configurationMaximumKilowattsPerDay = result.deviceConfiguration[0].configurationMaximumKilowattsPerDay;
          this.ConfigDeviceModel.connectionsConfigurations = result.deviceConfiguration[0].connectionsConfigurations;
          this.ConfigDeviceModel.deviceId = result.deviceConfiguration[0].deviceId;
          this.ConfigDeviceModel.configurationDays = result.deviceConfiguration[0].configurationDays;
          this.ConfigDeviceModel.status = result.deviceConfiguration[0].status; 
          //this.pesos = `RD$` + `${this.ConfigDeviceModel.configurationMaximumKilowattsPerDay * 0.3175}`;
          //this.ConfigDeviceModel.connectionsConfigurations = result.deviceConfiguration[0].connectionsConfigurations;
          //this.devicedConfigured = this.ConfigDeviceModel.connectionsConfigurations.length;
          console.log(this.ConfigDeviceModel);
        }else{

        }

      },
      error:(error) => {
        console.log(error);
      },
      complete: () => {
        this.loading.dismiss();
      }
    })
  }
  redirectToLoginPage(){
    this.router.navigateByUrl('/login');

  }

}
