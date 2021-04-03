import { FormGroup ,FormControl} from '@angular/forms';
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
  public userDevice:string ='';
  myDeviceFormGroup:FormGroup;
  daysConfigured:any = 0;
  devicesConnectedConfigurations:any = 0;
  devicesConnected:any = 0;
  constructor(public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public router:Router, public DynamoDBService: DynamoDBAPIService, 
    public ToastController : ToastController, public messageService:MessageService, public alertController: AlertController, public energyService:EnergyService,private apolloClient: Apollo, public navController:NavController, public MQTTServiceService:MQTTServiceService) { 
      this.myDeviceFormGroup = new FormGroup({
        'deviceName': new FormControl(this.ConfigDeviceModel.deviceId),
        'deviceOwner': new FormControl(this.userDevice),
        'registerDate': new FormControl(this.ConfigDeviceModel.registeredAt),
        'status': new FormControl(this.ConfigDeviceModel.status),
        'daysConfigured': new FormControl(this.daysConfigured),
        'ConnectedDevicesConfigurations': new FormControl(this.devicesConnectedConfigurations),
        'updateDate': new FormControl(this.ConfigDeviceModel.updatedAt)
      });

    }

  async ngOnInit() {
    try {
      await this.validateLoggedUser();
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 
   */
  async singOut(){
    await this.presentLoading();
    this.awsAmplifyService.singOut().then((result) => {
      if (result != undefined) {
      }else{
      }
    }).catch(() => {

    }).finally(() => {
      this.loading.dismiss();
    });

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
  /**
   * @method validateLoggedUser()
   * 
   */
  async validateLoggedUser(){
    await this.presentLoading();
    this.awsAmplifyService.getCurrentUser().then(async (result)=>{
      if (result != undefined) {
        try {
           this.userDevice = this.getDeviceName(result.attributes.email);
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
  /**
   * @function getDeviceName
   * @param username  
   * @returns string
   */
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
        this.loadAllRelays(deviceName);
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
          this.daysConfigured = this.ConfigDeviceModel.configurationDays.length;
          this.devicesConnectedConfigurations = this.ConfigDeviceModel.connectionsConfigurations.length;
          
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
  editMyDevice(){

  }
  async loadAllRelays(userEmail:any){
    var url = environment.DynamoBDEndPoints.ULR;
    var urlPath = environment.DynamoBDEndPoints.API_PATHS.getDeviceRelays;
    const urlFullPath = `${url}` + `${urlPath}` + `${userEmail}`;
    this.DynamoDBService.genericGetMethods(urlFullPath).subscribe({
      next: async (data) => {
        debugger;
        if (data != null || data != undefined || data.readings == undefined || data.data != undefined) {
          if (data.data.length > 0) {
            this.devicesConnected = data.data.length;
          } else {
            this.devicesConnected = 0;
          }
        }
      },
      error:async (error)=>{
        const alert = await this.alertController.create({
          header:'Error',
          message: error,
        });
        await alert.present();
      }
    })
  }

}
