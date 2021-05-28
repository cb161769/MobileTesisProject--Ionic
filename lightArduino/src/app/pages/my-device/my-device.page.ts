import { PopOverPage } from './../pop-over/pop-over.page';
import { FormGroup ,FormControl} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, NavController,ToastController, PopoverController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { MQTTServiceService } from 'src/app/data-services/MQTTService/mqttservice.service';
import { ConfigDeviceModel } from 'src/app/models/config-device-model';
import { environment } from 'src/environments/environment';
import { ConfigDaysModel } from 'src/app/models/config-days-model';


@Component({
  selector: 'app-my-device',
  templateUrl: './my-device.page.html',
  styleUrls: ['./my-device.page.scss'],
})
export class MyDevicePage implements OnInit {
  ConfigDeviceModel:ConfigDeviceModel = new ConfigDeviceModel();
  loading:any;
  public userDevice:string ='';
  public deviceUserName:string = '';
  myDeviceFormGroup:FormGroup;
  public daysConfigured:any = 0;
  devicesConnectedConfigurations:any = 0;
  public devicesConnected:any = 0;
  public userEmail:string = '';
  public devices :any = [];
  allDays:ConfigDaysModel[] = [];
  constructor(public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public router:Router, public DynamoDBService: DynamoDBAPIService, 
    public ToastController : ToastController,public popOver:PopoverController, public messageService:MessageService, public alertController: AlertController, public energyService:EnergyService,private apolloClient: Apollo, public navController:NavController, public MQTTServiceService:MQTTServiceService) { 
      this.myDeviceFormGroup = new FormGroup({
        'deviceName': new FormControl(this.ConfigDeviceModel.deviceId),
        'deviceOwner': new FormControl(this.deviceUserName),
        'registerDate': new FormControl(this.ConfigDeviceModel.registeredAt),
        'status': new FormControl(this.ConfigDeviceModel.status),
        'daysConfigured': new FormControl(this.daysConfigured),
        'ConnectedDevicesConfigurations': new FormControl(this.devicesConnectedConfigurations),
        'updateDate': new FormControl(this.ConfigDeviceModel.updatedAt),
        'connectedDevices': new FormControl(this.devicesConnected)
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
      }
    }).catch((error) => {

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
           this.loadAllRelays(result.attributes.email);
           this.deviceUserName = result.attributes.email;
           
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
   *@method openComponent
   * @returns PopOver
   * @author Claudio Raul Brito Mercedes
   * @username cb-161769
   */
  async openComponent() {
    const dataProps = this.ConfigDeviceModel.configurationDays;
    const popOver = await this.popOver.create({
      component: PopOverPage,
      componentProps:{
        dataTitle: 'Días',
        data: dataProps,
        isDays:true,
        isConfiguration:false,
        isConnections:false
      },
      translucent:true
    });
    return await popOver.present();
  }
  /**
   * @method openQuantityComponent
   * @returns PopOver
   * @author Claudio Raul Brito Mercedes
   * @username cb-161769
   * @description this method opens a popOver
   */
  async openQuantityComponent(){
    const dataProps = this.ConfigDeviceModel.connectionsConfigurations;
    const popOver = await this.popOver.create({
      component:PopOverPage,
      componentProps:{
        dataTitle:'Configuraciones de Conexiones',
        data:dataProps,
        isDays:false,
        isConfiguration:true,
        isConnections:false

      },
      translucent:true
    });
    return await popOver.present();
  }
  /**
   * @userName cb16-1769
   * @author Claudio Raul Brito Mercedes
   * @returns {popOver}
   */
  async openConnectionsComponent(){
    const dataProps = this.devices;
    const popOver = await this.popOver.create({
      component:PopOverPage,
      componentProps:{
        dataTitle:'Conexiones',
        data:dataProps,
        isDays:false,
        isConfiguration:false,
        isConnections:true
      },
      translucent:true
    });
    return await popOver.present();
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
        this.getDeviceConfiguration(deviceName);     
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
          this.ConfigDeviceModel.updatedAt = result.deviceConfiguration[0].updatedAt;
          this.ConfigDeviceModel.registeredAt = result.deviceConfiguration[0].registeredAt;
          this.daysConfigured = this.ConfigDeviceModel.configurationDays.length;
          this.devicesConnectedConfigurations = this.ConfigDeviceModel.connectionsConfigurations.length;
        }

      },
      error:async (error) => {
        const alert = await this.alertController.create({
          header:'Error',
          message: error,
        });
        await alert.present();
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
  loadDays(){
    let days = [
      {
      dayValue:'1'||1,
      dayName:'Lunes'
      },
      {
      dayValue:'2' || 2,
      dayName:'Martes'
      },
      {
      dayValue:'3' || 3,
      dayName:'Miercoles'
      },
      {
      dayValue:'4'|| 4,
      dayName:'Jueves'
      },
      {
      dayValue:'5' || 5,
      dayName:'Viernes'
      },
      {
      dayValue:'6' || 6,
      dayName:'Sabado'
      },
      {
      dayValue:'7'|| 7,
      dayName:'Domingo'
      }
      
  ];
    days.forEach(day => {
      this.allDays.push(day as ConfigDaysModel)
    });
  }
  async loadAllRelays(userEmail:any){
    var url = environment.DynamoBDEndPoints.ULR;
    var urlPath = environment.DynamoBDEndPoints.API_PATHS.getDeviceRelays;
    const urlFullPath = `${url}` + `${urlPath}` + `${userEmail}`;
    this.DynamoDBService.genericGetMethods(urlFullPath).subscribe({
      next: async (data) => {

        if (data != null || data != undefined || data.readings == undefined || data.data != undefined) {
          if (data.data.length > 0) {
            this.devicesConnected = data.data.length;
            this.devices = data.data;
          } else {
            this.devicesConnected = 0;
            this.devices = [];
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
