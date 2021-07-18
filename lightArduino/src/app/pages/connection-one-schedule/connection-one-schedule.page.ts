import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, NavController, ActionSheetController,ToastController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { interval, Observable, of } from "rxjs";
import { map } from 'rxjs/operators';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { LogModel } from 'src/app/models/log-model';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-connection-one-schedule',
  templateUrl: './connection-one-schedule.page.html',
  styleUrls: ['./connection-one-schedule.page.scss'],
})
export class ConnectionOneSchedulePage implements OnInit {

  constructor(public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public router: Router,
              public DynamoDBService: DynamoDBAPIService, public ToastController: ToastController, 
              public messageService: MessageService, public alertController: AlertController,
              public energyService: EnergyService, private apolloClient: Apollo, public navController: NavController,public actionSheetController: ActionSheetController) { }
  public test = [];
  public tests: Observable<any[]>;
  public testModel$: Observable<Array<any>>;
  public array = [];
  loading:any;
  userDevice:any;
  async ngOnInit() {
    try {
      await this.validateLoggedUser();
      // this.addArray();
    } catch (error) {
      
    }
     
  }
  /**
   * this method is to redirect to add-connection-schedule page
   */
  addConfiguration(){

    this.router.navigate(['connections-config-schedule']);


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
  /**
   * This method validates the Logged Device
   */
   async logDevice(log:LogModel){
    const url = environment.LoggerEndPoints.ULR;
    const loggerPath = environment.LoggerEndPoints.DatabaseLogger;
    const urlFullPath = `${url}` + `${loggerPath}`;
    await this.DynamoDBService.genericLogMethod(urlFullPath, log);
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
    this.awsAmplifyService.getCurrentUser().then(async (result) => {
      if (result != undefined) {
        try {
          this.userDevice = this.getDeviceName(result.attributes.email);
          this.loading.dismiss();
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
      }
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
    await this.PresentLoading();
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
    this.DynamoDBService.genericGetMethods(urlFullPath).subscribe({
      next: async (result) => {
        if (result != undefined) {
          let deviceConfig = result.deviceConfiguration[0].connectionsConfigurations;
          if (deviceConfig.length === 0) {
            const alert = await this.alertController.create({
          header:'Advertencia',
          subHeader:'no tiene Conexiones Configuradas',
          message:'Es necesario que configure las conexiones del dispositivo' +`${this.userDevice}`,
          buttons: [
            {
              text:'Aceptar',
              handler: async () => {  
                this.router.navigateByUrl('/connections-config-schedule');
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
            this.loading.dismiss();
            await alert.present();
        
            
        }else{
          this.array = [];
          this.array = result.deviceConfiguration[0].connectionsConfigurations;
          this.testModel$ = this.getConfigurationArray();
  
          
          
        }
         
        }

      },
      error: async (error) => {
        const logger = new LogModel();
        logger.level = 'ERROR';
        logger.route = '';
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
  configurationArray():any{
    let defaultArray = [];
    for (let index = 0; index < this.array.length; index++) {
          debugger;
          let time:Date = new Date( this.array[index].InitialTime);
            
          // var InitialTime = new Intl.DateTimeFormat("en-US", {hour: "numeric", minute: "numeric"}).format(time);
          // let final = new Date(this.array[index].FinalTime);
          // var FinalTime =  new Intl.DateTimeFormat("en-US", {hour: "numeric", minute: "numeric"}).format(final);
          // this.array[index].FinalTime = FinalTime;
          // this.array[index].InitialTime = InitialTime;
          let element = this.array[index];
          debugger;
          defaultArray.push(element);
      
    }
    return defaultArray;

  }
  getConfigurationArray(){
    return interval(10000).pipe(map(i => 
      this.configurationArray()
      ));
  }
  edit(){
    this.router.navigate(['edit-connection-schedule']);
  }
  


}
