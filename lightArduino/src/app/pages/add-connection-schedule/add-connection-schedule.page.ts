import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController,NavController, AlertController } from '@ionic/angular';
import { throwIfEmpty } from 'rxjs/operators';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { ConfigConnections } from 'src/app/models/config-connections';
import { ConfigDaysModel } from 'src/app/models/config-days-model';
import { ConfigDeviceModel } from 'src/app/models/config-device-model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-connection-schedule',
  templateUrl: './add-connection-schedule.page.html',
  styleUrls: ['./add-connection-schedule.page.scss'],
})
export class AddConnectionSchedulePage implements OnInit {
  AddConnectionScheduleForm:FormGroup;
  ConfigDeviceModel:ConfigDeviceModel = new ConfigDeviceModel();
  configConnectionModel:ConfigConnections = new ConfigConnections();
  daysModel:ConfigDaysModel[] = [];
  allDays:ConfigDaysModel[] = [];
  ionSelecNameCancel:string = 'Cancelar';
  ionSelecNameOk:string = 'Ok';
  loading:any;
  userDevice:string ='';

  constructor(
    public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public navController:NavController,public toast:ToastService,
    public ToastController : ToastController,public alertController: AlertController, public router:Router, public messageService:MessageService, public dynamoDBService: DynamoDBAPIService
  ) { 
    this.AddConnectionScheduleForm = new FormGroup({
      'configurationTitle': new FormControl(this.configConnectionModel.configurationTitle,[Validators.required]),
      'InitialTime': new FormControl(this.configConnectionModel.InitialTime,[Validators.required]),
      'FinalTime': new FormControl(this.configConnectionModel.FinalTime,[Validators.required]),
      'isActive': new FormControl(this.configConnectionModel.isActive,[Validators.required]),
      'maximumKilowattPerDay': new FormControl(this.configConnectionModel.maximumKilowattPerDay,[Validators.required]),
      'configurationDays': new FormControl(this.configConnectionModel.days,[Validators.required]),
    })

  }

  async ngOnInit() {
    this.loadDays();
    try {
      await this.validateLoggedUser();
    } catch (error) {
      
    }
  }
  doRefresh(event:any){

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
  async addConfiguration(){
    const connectionModel:ConfigConnections[] = [];
    connectionModel.push(this.configConnectionModel);
    debugger;
    this.ConfigDeviceModel.connectionsConfigurations.push(connectionModel[0])
    await this.presentLoading();
      var url = environment.DynamoBDEndPoints.ULR;
      var urlPath = environment.DynamoBDEndPoints.API_PATHS.addDeviceConfiguration;
      const urlFullPath = `${url}` + `${urlPath}`;
      this.dynamoDBService.genericPostMethod(urlFullPath,this.ConfigDeviceModel).subscribe({
        next: async (data) => {
          if (data.status == 200) {
            const toast = await this.ToastController.create({
              message: 'Datos Ingresados Satisfactoriamente',
              duration: 2000,
              position: 'bottom',
              color: 'dark'
            });
            toast.present();
            this.loading.dismiss();
            this.AddConnectionScheduleForm.reset();
            this.router.navigateByUrl('/connection-one-schedule');

          }
        },
        error: async () => {
          const toast = await this.ToastController.create({
            message: 'Ha ocurrido un error',
            duration: 2000,
            position: 'bottom',
            color: 'dark'
          });
          toast.present();
          this.loading.dismiss();
          return;
        },
        complete: () => {
          this.loading.dismiss();
        }
      })

  }
  getDeviceName(username:string):string{
    let url = environment.DynamoBDEndPoints.ULR;
    let url_path = environment.DynamoBDEndPoints.API_PATHS.getDeviceConfiguration;
    let deviceName;
    const urlFullPath = `${url}` + `${url_path}` + `/${username}`;
    this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
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
    this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
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

}
