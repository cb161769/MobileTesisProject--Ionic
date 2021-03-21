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

    this.router.navigate(['add-connection-schedule'])


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
  async validateLoggedUser(){
    await this.PresentLoading();
    this.awsAmplifyService.getCurrentUser().then(async (result) => {
      if (result != undefined) {
        try {
          this.userDevice = this.getDeviceName(result.attributes.email);
          this.loading.dismiss();
        } catch (error) {
          console.log(error)
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
    await this.PresentLoading();
    let url = environment.DynamoBDEndPoints.ULR;
    let urlPath = environment.DynamoBDEndPoints.API_PATHS.getArduinoDeviceConfiguration;  
    const urlFullPath = `${url}` + `${urlPath}` + `/${device}`
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
                this.router.navigateByUrl('/add-connection-schedule');
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
         
         
          // // console.log(deviceConfig);
          // // let model$: Observable<any[]>;
          // // for (let index = 0; index < deviceConfig.length; index++) {
            
          // //   let time:Date = new Date( parseInt(deviceConfig[index].InitialTime));
            
          // //   var InitialTime = new Intl.DateTimeFormat("en-US", {hour: "numeric", minute: "numeric"}).format(time);
          // //   let final = new Date(parseInt(deviceConfig[index].FinalTime));
          // //   var FinalTime =  new Intl.DateTimeFormat("en-US", {hour: "numeric", minute: "numeric"}).format(final);
            
         
          // //   model$ = of([
          // //    {configurationTitle: deviceConfig[index].configurationTitle,
          // //     InitialTime: InitialTime,
          // //     FinalTime: FinalTime,
          // //     isActive: deviceConfig[index].isActive,
          // //     days: deviceConfig[index].days,
          // //     maximumKilowattPerDay: deviceConfig[index].maximumKilowattPerDay
          // //   }
          // //  ])
          // //  this.test.push(model$[index]);
           
            
          // }
          
          
        }
          /*
          this.ConfigDeviceModel.configurationId = result.deviceConfiguration[0].configurationId;
          this.ConfigDeviceModel.configurationMaximumKilowattsPerDay = result.deviceConfiguration[0].configurationMaximumKilowattsPerDay;
          this.ConfigDeviceModel.connectionsConfigurations = result.deviceConfiguration[0].connectionsConfigurations;
          this.ConfigDeviceModel.deviceId = result.deviceConfiguration[0].deviceId;
          this.ConfigDeviceModel.configurationDays = result.deviceConfiguration[0].configurationDays;
          this.ConfigDeviceModel.status = result.deviceConfiguration[0].status; 
          this.pesos = `RD$` + `${this.ConfigDeviceModel.configurationMaximumKilowattsPerDay * 0.3175}`;
          //this.ConfigDeviceModel.connectionsConfigurations = result.deviceConfiguration[0].connectionsConfigurations;
          this.devicedConfigured = this.ConfigDeviceModel.connectionsConfigurations.length;
          */
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
  configurationArray():any{
    let defaultArray = [];
    for (let index = 0; index < this.array.length; index++) {
      
         let time:Date = new Date( parseInt(this.array[index].InitialTime));
            
            var InitialTime = new Intl.DateTimeFormat("en-US", {hour: "numeric", minute: "numeric"}).format(time);
            let final = new Date(parseInt(this.array[index].FinalTime));
            var FinalTime =  new Intl.DateTimeFormat("en-US", {hour: "numeric", minute: "numeric"}).format(final);
            this.array[index].FinalTime = FinalTime;
            this.array[index].InitialTime = InitialTime;
            let element = this.array[index];
           defaultArray.push(element)
      
    }
    return defaultArray;

  }
  getConfigurationArray(){
    return interval(1000).pipe(map(i => 
      this.configurationArray()
      ))
  }
  /**
   * 
   */
  // addArray(){
  //   this.test.push({
  //     configurationTitle:'Configuracion de la Manana',
  //     InitialTime:'07:00am',
  //     FinalTime:'11:00am',
  //     isActive:true,
  //     days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
  //     maximumKilowattPerDay:'500'
  //     },
  //     {
  //       configurationTitle:'Configuracion de la Tarde',
  //       InitialTime:'07:00am',
  //       FinalTime:'12:00am',
  //       isActive:true,
  //       days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
  //       maximumKilowattPerDay:'500'
  //       },
  //       {
  //         configurationTitle:'Configuracion de la Noche',
  //         InitialTime:'12:01pm',
  //         FinalTime:'11:00am',
  //         isActive:true,
  //         days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
  //         maximumKilowattPerDay:'700'
  //       },
  //       {
  //         configurationTitle:'Configuracion Por defecto',
  //         InitialTime:'12:01pm',
  //         FinalTime:'11:00am',
  //         isActive:true,
  //         days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
  //         maximumKilowattPerDay:'700'
  //       })
  //   // this.tests = of([{
  //   //   configurationTitle:'Configuracion de la Manana',
  //   //   InitialTime:'07:00am',
  //   //   FinalTime:'11:00am',
  //   //   isActive:true,
  //   //   days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
  //   //   maximumKilowattPerDay:'500'
  //   //   },
  //   //   {
  //   //     configurationTitle:'Configuracion de la Tarde',
  //   //     InitialTime:'07:00am',
  //   //     FinalTime:'12:00am',
  //   //     isActive:true,
  //   //     days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
  //   //     maximumKilowattPerDay:'500'
  //   //     },
  //   //     {
  //   //       configurationTitle:'Configuracion de la Noche',
  //   //       InitialTime:'12:01pm',
  //   //       FinalTime:'11:00am',
  //   //       isActive:true,
  //   //       days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
  //   //       maximumKilowattPerDay:'700'
  //   //     },
  //   //     {
  //   //       configurationTitle:'Configuracion Por defecto',
  //   //       InitialTime:'12:01pm',
  //   //       FinalTime:'11:00am',
  //   //       isActive:true,
  //   //       days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
  //   //       maximumKilowattPerDay:'700'
  //   //     }])
  // }
  edit(){
    this.router.navigate(['edit-connection-schedule']);
  }
  


}
