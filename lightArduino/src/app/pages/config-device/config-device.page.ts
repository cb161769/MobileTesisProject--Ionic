import { ConfigDeviceModel } from './../../models/config-device-model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { environment } from 'src/environments/environment';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { ConfigDaysModel } from 'src/app/models/config-days-model';

@Component({
  selector: 'app-config-device',
  templateUrl: './config-device.page.html',
  styleUrls: ['./config-device.page.scss'],
})
export class ConfigDevicePage implements OnInit {
  configDeviceForm: FormGroup;
  ConfigDeviceModel:ConfigDeviceModel = new ConfigDeviceModel();
  loading:any;
  deviceName:string = '';
  allDays:ConfigDaysModel[] = [];
  ionSelecNameCancel:string = 'Cancelar';
  ionSelecNameOk:string = 'Ok';
  constructor(
    public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public navController:NavController,public toast:ToastService,
    public ToastController : ToastController,public alertController:AlertController, public router:Router, public messageService:MessageService, public dynamoDBService: DynamoDBAPIService
  ) { 
    this.configDeviceForm = new FormGroup({
      'configurationCode': new FormControl(this.ConfigDeviceModel.configurationId, [Validators.required]),
      'configurationName': new FormControl(this.ConfigDeviceModel.configurationName,[Validators.required]),
      'configurationDays': new FormControl(this.ConfigDeviceModel.configurationDays,[Validators.required]),
      'configurationMaximumKilowattsPerDay': new FormControl(this.ConfigDeviceModel.configurationMaximumKilowattsPerDay,[Validators.required]),
      'deviceId': new FormControl(this.ConfigDeviceModel.deviceId,[Validators.required]),
      'status': new FormControl(this.ConfigDeviceModel.status),
      'connectionConfigurations': new FormControl(this.ConfigDeviceModel.connectionsConfigurations)

    })

  }

  async ngOnInit() {
    this.loadDays();
    try {
      await this.validateLoggedUser();
    } catch (error) {
      console.log(error);
    }

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
  goBack():void{

  }
  async configDevice(){
    await this.PresentLoading();
    var url = environment.DynamoBDEndPoints.ULR;
    var urlPath = environment.DynamoBDEndPoints.API_PATHS.addDeviceConfiguration
    const urlFullPath = `${url}` + `${urlPath}`;
    this.dynamoDBService.genericPostMethod(urlFullPath,this.ConfigDeviceModel).subscribe(async (data) =>{
      if (data.status === 200) {
        const toast = await this.ToastController.create({
          message: 'Datos Ingresados Satisfactoriamente',
          duration: 2000,
          position: 'bottom',
          color: 'dark'
        });
        toast.present();
        this.loading.dismiss();
        this.configDeviceForm.reset();
      }
      else{
        const toast = await this.ToastController.create({
          message: 'Ha ocurrido un error, intentelo nuevamente',
          duration: 2000,
          position: 'bottom',
          color: 'dark'
        });
        toast.present();
      }
    })
  }
  /**
   * this method is for the user's Sing Out
   */
  singOut():void{

  }
  doRefresh(event) {
    console.log('Begin async operation');
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  redirectToLoginPage(){
    this.router.navigateByUrl('/login');

  }
  redirectToHomeDevicePage(){
    this.router.navigateByUrl('/home-device-page');

  }
  async validateLoggedUser(){
    await this.PresentLoading();
    this.awsAmplifyService.getCurrentUser().then(async (result)=>{
      if (result != undefined) {
        try {
        this.getDeviceName(result.attributes.email);
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

    }).finally(() =>{
      this.loading.dismiss();
    })
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
          debugger;
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
