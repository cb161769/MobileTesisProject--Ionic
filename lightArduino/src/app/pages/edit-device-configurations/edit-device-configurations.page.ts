import { LogModel } from 'src/app/models/log-model';
import { ConfigDeviceModel } from './../../models/config-device-model';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ConfigDeviceModel } from 'src/app/models/config-device-model';
import { Router } from '@angular/router';
import { LoadingController, NavController,ToastController,AlertController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-device-configurations',
  templateUrl: './edit-device-configurations.page.html',
  styleUrls: ['./edit-device-configurations.page.scss'],
})
export class EditDeviceConfigurationsPage implements OnInit, OnDestroy {
  editDeviceConfigurationForm: FormGroup;
  ConfigDeviceModel:ConfigDeviceModel = new ConfigDeviceModel();
  loading:any;
  userDevice:any;
  Days:any;
  ionSelecNameCancel:string = 'Cancelar';
  ionSelecNameOk:string = 'Ok';
  pesos:any = '';
  devicedConfigured:number = 0;
  constructor(public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public navController:NavController,public toast:ToastService,
    public ToastController : ToastController,public alertController: AlertController, public router:Router, public messageService:MessageService, public dynamoDBService: DynamoDBAPIService) { 
      this.editDeviceConfigurationForm = new FormGroup({
        'configurationName': new FormControl(this.ConfigDeviceModel.configurationName,[Validators.required]),
        'configurationDays': new FormControl(this.ConfigDeviceModel.configurationDays,[Validators.required]),
        'configurationId': new FormControl(this.Days,[Validators.required]),
        'status': new FormControl(this.ConfigDeviceModel.status,[Validators.required]),
        'configurationMaximumKilowattsPerDay': new FormControl(this.ConfigDeviceModel.configurationMaximumKilowattsPerDay,[Validators.required,Validators.min(0)]),
        'pesosEquivalent': new FormControl(this.pesos,[Validators.required]),
        'configuredDevices': new FormControl(this.devicedConfigured,[Validators.required])
      })
    }
  
  async ngOnInit() {
    try {
      await this.validateLoggedUser().then(() => {
      
      });
      
    } catch (error) {
      console.log(error);
    }

  }
  singOut(){

  }
  async logDevice(log:LogModel){
    const url = environment.LoggerEndPoints.ULR;
    const loggerPath = environment.LoggerEndPoints.DatabaseLogger;
    const urlFullPath = `${url}` + `${loggerPath}`;
    await this.dynamoDBService.genericLogMethod(urlFullPath, log);
  }
  /**
   * 
   * @param username  the devoc
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
  async getDeviceConfiguration(device:string){
    await this.presentLoading();
    let url = environment.DynamoBDEndPoints.ULR;
    let urlPath = environment.DynamoBDEndPoints.API_PATHS.getArduinoDeviceConfiguration;  
    const urlFullPath = `${url}` + `${urlPath}` + `/${device}`;
    const logger = new LogModel();
    logger.level = 'INFO';
    logger.route = urlFullPath;
    logger.action = 'getDeviceConfiguration';
    logger.timeStamp = new Date();
    logger.userName = '';
    await this.logDevice(logger);
    this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
      next: async (result) => {
        if (result != undefined) {
          this.ConfigDeviceModel.configurationId = result.deviceConfiguration[0].configurationId;
          this.ConfigDeviceModel.configurationMaximumKilowattsPerDay = result.deviceConfiguration[0].configurationMaximumKilowattsPerDay;
          this.ConfigDeviceModel.connectionsConfigurations = result.deviceConfiguration[0].connectionsConfigurations;
          this.ConfigDeviceModel.deviceId = result.deviceConfiguration[0].deviceId;
          this.ConfigDeviceModel.configurationDays = result.deviceConfiguration[0].configurationDays;
          this.ConfigDeviceModel.status = result.deviceConfiguration[0].status; 
          this.pesos = `RD$` + `${this.ConfigDeviceModel.configurationMaximumKilowattsPerDay * 0.3175}`;
          //this.ConfigDeviceModel.connectionsConfigurations = result.deviceConfiguration[0].connectionsConfigurations;
          this.devicedConfigured = this.ConfigDeviceModel.connectionsConfigurations.length;
          
        }else{

        }

      },
      error: async (error) => {
        const logger = new LogModel();
        logger.level = 'ERROR';
        logger.route = urlFullPath;
        logger.action = 'getDeviceConfiguration';
        logger.timeStamp = new Date();
        logger.userName = '';
        logger.logError = error;
        await this.logDevice(logger);
        console.log(error);
      },
      complete: () => {
        this.loading.dismiss();
      }
    })
  }
  async ionViewDidEnter(){
   
  }
  async ionViewDidLeave(){
   
  }
  async ionViewWillEnter(){
    
   
  }
  async editDevice(){

  }
  async presentLoading(){
    this.loading = await this.loadingIndicator.create({
      message: 'Cargando ...',
      spinner: 'dots',
    });
    await this.loading.present();
  }
  async validateLoggedUser(){
    await this.PresentLoading();
    const logger = new LogModel();
    logger.level = 'INFO';
    logger.route = '';
    logger.action = 'validateLoggedUser';
    logger.timeStamp = new Date();
    logger.userName = '';
    await this.logDevice(logger);
    this.awsAmplifyService.getCurrentUser().then(async (result)=>{
      if (result != undefined) {
        try {
           this.userDevice = this.getDeviceName(result.attributes.email)

        // await this.getAllFares();
      } catch (error) {
        const logger = new LogModel();
        logger.level = 'ERROR';
        logger.route = '';
        logger.action = 'validateLoggedUser';
        logger.timeStamp = new Date();
        logger.userName = '';
        logger.logError = error;
        await this.logDevice(logger);
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
  redirectToLoginPage(){
    this.router.navigateByUrl('/login');

  }
  redirectToHomeDevicePage(){
    this.router.navigateByUrl('/home-device-page');

  }
    /**
   * this method is to present a loading Indicator
   */
     async PresentLoading(){
      this.loading = await this.loadingIndicator.create({
        message:'Cargando ...',
        spinner:'dots'
      });
      await this.loading.present();
  
    }
    ngOnDestroy(): void {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      
    }
    async configureDevice(){
      await this.presentLoading();
      var url = environment.DynamoBDEndPoints.ULR;
      var urlPath = environment.DynamoBDEndPoints.API_PATHS.addDeviceConfiguration;
      const urlFullPath = `${url}` + `${urlPath}`;
      const logger = new LogModel();
      logger.level = 'INFO';
      logger.route = urlPath;
      logger.action = 'configureDevice';
      logger.timeStamp = new Date();
      logger.userName = '';
      await this.logDevice(logger);
      if (this.devicedConfigured == 0){
        this.loading.dismiss();
        const alert = await this.alertController.create({
          header:'Advertencia',
          subHeader:'no tiene Conexiones Configuradas',
          message:'Es necesario que configure las conexiones del dispositivo' +`${this.ConfigDeviceModel.configurationName}`,
          buttons: [
            {
              text:'Aceptar',
              handler: async () => {
                await this.redirectConfigConnectionsPage();

              }
            },
            {
              text:'Cancelar',
              handler: async () => {
                return;

              }
            }
          ]
        });
        await alert.present();
      }else{
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
              this.editDeviceConfigurationForm.reset();
  
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
      


    }
    async redirectConfigConnectionsPage(){
      this.router.navigateByUrl('/connection-one-schedule');

    }

}
